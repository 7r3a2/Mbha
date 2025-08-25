import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth-utils';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const tests = await prisma.previousTest.findMany({
      where: {
        userId: decoded.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ tests });
  } catch (error) {
    console.error('Error fetching previous tests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { name, questionCount, mode, timeLimit, questionMode, sources, topics, subject } = body;

    const test = await prisma.previousTest.create({
      data: {
        userId: decoded.userId,
        name,
        questionCount,
        mode,
        timeLimit: timeLimit || null,
        questionMode,
        sources: sources ? JSON.stringify(sources) : null,
        topics: topics ? JSON.stringify(topics) : null,
        subject
      }
    });

    return NextResponse.json({ test });
  } catch (error) {
    console.error('Error creating previous test:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
