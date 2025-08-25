import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkUserSessions, createUserSession, lockUserAccount, deactivateAllUserSessions } from '@/lib/session-utils';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Testing session management functionality...');
    
    // Get a test user
    const testUser = await prisma.user.findFirst({
      where: {
        email: {
          not: {
            in: ['admin@mbha.com', 'admin@mbha.net']
          }
        }
      }
    });
    
    if (!testUser) {
      return NextResponse.json({
        success: false,
        message: 'No regular user found for testing'
      });
    }
    
    console.log('✅ Found test user:', testUser.email);
    
    // Test 1: Check current sessions
    const { activeSessions, shouldLock } = await checkUserSessions(testUser.id);
    console.log('📊 Current sessions:', { activeSessions, shouldLock });
    
    // Test 2: Create a new session
    console.log('🆕 Creating new session...');
    const sessionId = await createUserSession(testUser.id, request);
    console.log('✅ Session created:', sessionId);
    
    // Test 3: Check sessions again
    const { activeSessions: newActiveSessions, shouldLock: newShouldLock } = await checkUserSessions(testUser.id);
    console.log('📊 Sessions after creation:', { newActiveSessions, newShouldLock });
    
    // Test 4: Create another session (simulate second device)
    console.log('🆕 Creating second session...');
    const sessionId2 = await createUserSession(testUser.id, request);
    console.log('✅ Second session created:', sessionId2);
    
    // Test 5: Check sessions again
    const { activeSessions: finalActiveSessions, shouldLock: finalShouldLock } = await checkUserSessions(testUser.id);
    console.log('📊 Final sessions:', { finalActiveSessions, finalShouldLock });
    
    // Test 6: Try to lock account
    if (finalActiveSessions > 1) {
      console.log('🔒 Testing account lock...');
      await lockUserAccount(testUser.id);
      console.log('✅ Account locked');
    }
    
    // Test 7: Deactivate all sessions
    console.log('🔄 Deactivating all sessions...');
    await deactivateAllUserSessions(testUser.id);
    console.log('✅ All sessions deactivated');
    
    // Test 8: Check final state
    const { activeSessions: finalCheck, shouldLock: finalCheckLock } = await checkUserSessions(testUser.id);
    console.log('📊 Final check:', { finalCheck, finalCheckLock });
    
    return NextResponse.json({
      success: true,
      message: 'Session management test completed',
      results: {
        initialSessions: activeSessions,
        afterFirstSession: newActiveSessions,
        afterSecondSession: finalActiveSessions,
        finalSessions: finalCheck,
        shouldLock: finalShouldLock,
        testUser: {
          id: testUser.id,
          email: testUser.email
        }
      }
    });
  } catch (error) {
    console.error('❌ Session test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Session management test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
