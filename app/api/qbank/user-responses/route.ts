import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';

function getUserIdFromToken(request: NextRequest): string | null {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.userId || null;
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { questionId, userAnswer, isCorrect, isFlagged } = body;

    if (!questionId || userAnswer === undefined || isCorrect === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (userAnswer < 0 || userAnswer > 4) {
      return NextResponse.json({ error: 'Invalid answer value' }, { status: 400 });
    }

    const response = await prisma.userResponse.upsert({
      where: {
        userId_questionId: {
          userId,
          questionId: questionId.toString(),
        },
      },
      update: {
        userAnswer,
        isCorrect,
        isFlagged: isFlagged || false,
        answeredAt: new Date(),
      },
      create: {
        userId,
        questionId: questionId.toString(),
        userAnswer,
        isCorrect,
        isFlagged: isFlagged || false,
      },
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save response' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const questionIds = searchParams.get('questionIds');
    const mode = searchParams.get('mode');

    if (!questionIds) {
      return NextResponse.json({ error: 'questionIds parameter required' }, { status: 400 });
    }

    const questionIdArray = questionIds.split(',').map(id => id.trim());

    const responses = await prisma.userResponse.findMany({
      where: {
        userId,
        questionId: { in: questionIdArray },
      },
      select: {
        questionId: true,
        userAnswer: true,
        isCorrect: true,
        isFlagged: true,
        answeredAt: true,
      },
    });

    const responseMap = responses.reduce((acc: Record<string, unknown>, response) => {
      acc[response.questionId] = response;
      return acc;
    }, {});

    let filteredQuestionIds: string[];

    switch (mode) {
      case 'unused':
        filteredQuestionIds = questionIdArray.filter(id => !responseMap[id]);
        break;
      case 'incorrect':
        filteredQuestionIds = questionIdArray.filter(id => {
          const r = responseMap[id] as { isCorrect?: boolean } | undefined;
          return r && !r.isCorrect;
        });
        break;
      case 'flagged':
        filteredQuestionIds = questionIdArray.filter(id => {
          const r = responseMap[id] as { isFlagged?: boolean } | undefined;
          return r && r.isFlagged;
        });
        break;
      default:
        filteredQuestionIds = questionIdArray;
    }

    return NextResponse.json({ responses: responseMap, filteredQuestionIds, mode });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deleteResult = await prisma.userResponse.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true, deletedCount: deleteResult.count });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete responses' }, { status: 500 });
  }
}
