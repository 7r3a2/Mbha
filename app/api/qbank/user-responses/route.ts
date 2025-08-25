import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const authHeader = request.headers.get('authorization');
    console.log('🔍 Authorization header received:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('🔍 Token extracted:', token ? `${token.substring(0, 20)}...` : 'null');
    console.log('🔍 Token length:', token?.length);
    console.log('🔍 Full token:', token);
    
    if (!token) {
      console.log('❌ No authorization token in user responses POST');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔍 About to verify token...');
    const user = await verifyToken(token);
    console.log('🔍 Token verification result:', user ? `User ID: ${user.userId}` : 'null');
    console.log('🔍 Full user object:', user);
    
    // Manual JWT verification for debugging
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
      console.log('🔍 JWT_SECRET being used:', JWT_SECRET);
      console.log('🔍 JWT_SECRET length:', JWT_SECRET.length);
      
      const manualVerification = jwt.verify(token, JWT_SECRET);
      console.log('🔍 Manual JWT verification result:', manualVerification);
    } catch (jwtError: any) {
      console.log('🔍 Manual JWT verification failed:', jwtError.message);
    }
    
    if (!user) {
      console.log('❌ Invalid token in user responses POST');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { questionId, userAnswer, isCorrect, isFlagged } = body;

    console.log(`💾 Saving user response - User: ${user.userId}, Question: ${questionId}, Answer: ${userAnswer}, Correct: ${isCorrect}, Flagged: ${isFlagged}`);

    if (!questionId || userAnswer === undefined || isCorrect === undefined) {
      console.log('❌ Missing required fields in user response');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Allow userAnswer to be 0-4 (0 can be used for flagging without answering)
    if (userAnswer < 0 || userAnswer > 4) {
      console.log('❌ Invalid user answer value:', userAnswer);
      return NextResponse.json({ error: 'Invalid answer value' }, { status: 400 });
    }

    // Upsert user response (update if exists, create if not)
    const response = await prisma.userResponse.upsert({
      where: {
        userId_questionId: {
          userId: user.userId,
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
        userId: user.userId,
        questionId: questionId.toString(),
        userAnswer,
        isCorrect,
        isFlagged: isFlagged || false
      }
    });

    console.log(`✅ User response saved successfully: ${response.id}`);
    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('❌ Error saving user response:', error);
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
        userId: user.userId,
        questionId: {
          in: questionIdArray
        }
      }
    });

    // Create a map of questionId to response
    const responseMap = responses.reduce((acc: Record<string, any>, response: any) => {
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
