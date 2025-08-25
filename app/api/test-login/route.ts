import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createUserSession, checkUserSessions } from '@/lib/session-utils';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Testing session management...');
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection works');
    
    // Get a test user (first user in the database)
    const testUser = await prisma.user.findFirst();
    if (!testUser) {
      return NextResponse.json({
        success: false,
        message: 'No users found in database'
      });
    }
    
    console.log('✅ Found test user:', testUser.email);
    
    // Test 1: Check if sessions table exists by trying to create a session
    try {
      console.log('🔨 Testing session creation...');
      const sessionId = await createUserSession(testUser.id, request);
      console.log('✅ Session created successfully:', sessionId);
      
      // Test 2: Check user sessions
      const { activeSessions, shouldLock } = await checkUserSessions(testUser.id);
      console.log('✅ Session check successful:', { activeSessions, shouldLock });
      
      return NextResponse.json({
        success: true,
        message: 'Session management is working',
        sessionId: sessionId,
        activeSessions: activeSessions,
        shouldLock: shouldLock
      });
    } catch (error) {
      console.log('❌ Session management failed:', error);
      
      return NextResponse.json({
        success: false,
        message: 'Session management failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
    return NextResponse.json(
      { 
        error: 'Test failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Testing session management...');
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection works');
    
    // Get a test user (first user in the database)
    const testUser = await prisma.user.findFirst();
    if (!testUser) {
      return NextResponse.json({
        success: false,
        message: 'No users found in database'
      });
    }
    
    console.log('✅ Found test user:', testUser.email);
    
    // Test 1: Check if sessions table exists by trying to create a session
    try {
      console.log('🔨 Testing session creation...');
      const sessionId = await createUserSession(testUser.id, request);
      console.log('✅ Session created successfully:', sessionId);
      
      // Test 2: Check user sessions
      const { activeSessions, shouldLock } = await checkUserSessions(testUser.id);
      console.log('✅ Session check successful:', { activeSessions, shouldLock });
      
      return NextResponse.json({
        success: true,
        message: 'Session management is working',
        sessionId: sessionId,
        activeSessions: activeSessions,
        shouldLock: shouldLock
      });
    } catch (error) {
      console.log('❌ Session management failed:', error);
      
      return NextResponse.json({
        success: false,
        message: 'Session management failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
    return NextResponse.json(
      { 
        error: 'Test failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
