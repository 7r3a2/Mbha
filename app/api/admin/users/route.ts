import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test');
    
    if (test === 'sessions') {
      console.log('🔧 Testing session management...');
      
      try {
        const { prisma } = await import('@/lib/prisma');
        const { createUserSession, checkUserSessions } = await import('@/lib/session-utils');
        
        // Get a test user
        const testUser = await prisma.user.findFirst();
        if (!testUser) {
          return NextResponse.json({
            success: false,
            message: 'No users found in database'
          });
        }
        
        console.log('✅ Found test user:', testUser.email);
        
        // Try to create a session
        console.log('🔨 Testing session creation...');
        const sessionId = await createUserSession(testUser.id, request);
        console.log('✅ Session created successfully:', sessionId);
        
        // Check user sessions
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
    }
    
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}