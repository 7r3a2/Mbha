import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '@/lib/auth-utils';

// File path for previous tests
const PREVIOUS_TESTS_FILE = path.join(process.cwd(), 'data', 'previous-tests.json');

// Ensure data file exists
const ensureFileExists = () => {
  if (!fs.existsSync(PREVIOUS_TESTS_FILE)) {
    fs.writeFileSync(PREVIOUS_TESTS_FILE, '[]');
  }
};

// Load previous tests from file
const loadPreviousTests = () => {
  ensureFileExists();
  try {
    const data = fs.readFileSync(PREVIOUS_TESTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading previous tests:', error);
    return [];
  }
};

// Save previous tests to file
const savePreviousTests = (tests: any[]) => {
  ensureFileExists();
  try {
    fs.writeFileSync(PREVIOUS_TESTS_FILE, JSON.stringify(tests, null, 2));
  } catch (error) {
    console.error('Error saving previous tests:', error);
    throw error;
  }
};

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

    const allTests = loadPreviousTests();
    const userTests = allTests.filter((test: any) => test.userId === decoded.userId);

    return NextResponse.json({ tests: userTests });
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

    const allTests = loadPreviousTests();
    const newTest = {
      id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: decoded.userId,
      name,
      questionCount,
      mode,
      timeLimit: timeLimit || null,
      questionMode,
      sources: sources ? JSON.stringify(sources) : null,
      topics: topics ? JSON.stringify(topics) : null,
      subject,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    allTests.push(newTest);
    savePreviousTests(allTests);

    return NextResponse.json({ test: newTest });
  } catch (error) {
    console.error('Error creating previous test:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
