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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const testId = params.id;
    const allTests = loadPreviousTests();

    // Verify the test belongs to the user
    const testIndex = allTests.findIndex((test: any) => 
      test.id === testId && test.userId === decoded.userId
    );

    if (testIndex === -1) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Remove the test
    allTests.splice(testIndex, 1);
    savePreviousTests(allTests);

    return NextResponse.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Error deleting previous test:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
