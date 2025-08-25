import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { questionId, userAnswer, isCorrect, isFlagged } = body;

    if (!questionId || userAnswer === undefined || isCorrect === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upsert user response (update if exists, create if not)
    const response = await prisma.userResponse.upsert({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId: questionId.toString()
        }
      },
      update: {
        userAnswer,
        isCorrect,
        isFlagged: isFlagged || false,
        answeredAt: new Date()
      },
      create: {
        userId: user.id,
        questionId: questionId.toString(),
        userAnswer,
        isCorrect,
        isFlagged: isFlagged || false
      }
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('Error saving user response:', error);
    return NextResponse.json({ error: 'Failed to save response' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify user authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const questionIds = searchParams.get('questionIds');
    const mode = searchParams.get('mode'); // 'all', 'unused', 'incorrect', 'flagged'

    if (!questionIds) {
      return NextResponse.json({ error: 'questionIds parameter required' }, { status: 400 });
    }

    const questionIdArray = questionIds.split(',').map(id => id.trim());
    
    // Get user responses for the specified questions
    const responses = await prisma.userResponse.findMany({
      where: {
        userId: user.id,
        questionId: {
          in: questionIdArray
        }
      }
    });

    // Create a map of questionId to response
    const responseMap = responses.reduce((acc, response) => {
      acc[response.questionId] = response;
      return acc;
    }, {} as Record<string, any>);

    // Filter questions based on mode
    let filteredQuestionIds: string[] = [];
    
    switch (mode) {
      case 'all':
        // Return all questions
        filteredQuestionIds = questionIdArray;
        break;
      case 'unused':
        // Return questions that user hasn't answered
        filteredQuestionIds = questionIdArray.filter(id => !responseMap[id]);
        break;
      case 'incorrect':
        // Return questions that user answered incorrectly
        filteredQuestionIds = questionIdArray.filter(id => 
          responseMap[id] && !responseMap[id].isCorrect
        );
        break;
      case 'flagged':
        // Return questions that user flagged
        filteredQuestionIds = questionIdArray.filter(id => 
          responseMap[id] && responseMap[id].isFlagged
        );
        break;
      default:
        // Default to 'all'
        filteredQuestionIds = questionIdArray;
    }

    return NextResponse.json({ 
      responses: responseMap,
      filteredQuestionIds,
      mode 
    });
  } catch (error) {
    console.error('Error fetching user responses:', error);
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }
}
