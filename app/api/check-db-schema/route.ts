import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking database schema...');
    
    const results: any = {};
    
    // Check if users table has isLocked field
    try {
      const user = await prisma.user.findFirst({
        select: {
          id: true,
          email: true,
          isLocked: true,
          lastLoginAt: true
        }
      });
      results.usersTable = {
        exists: true,
        hasIsLocked: 'isLocked' in (user || {}),
        hasLastLoginAt: 'lastLoginAt' in (user || {}),
        sampleUser: user ? { id: user.id, email: user.email, isLocked: user.isLocked } : null
      };
    } catch (error) {
      results.usersTable = {
        exists: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
    
    // Check if user_sessions table exists
    try {
      const sessionCount = await prisma.userSession.count();
      results.userSessionsTable = {
        exists: true,
        sessionCount: sessionCount
      };
    } catch (error) {
      results.userSessionsTable = {
        exists: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
    
    // Try to create a test session
    try {
      const testUser = await prisma.user.findFirst();
      if (testUser) {
        const sessionId = await prisma.userSession.create({
          data: {
            userId: testUser.id,
            sessionId: 'test-session-' + Date.now(),
            deviceInfo: 'Test Device',
            ipAddress: '127.0.0.1',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
          }
        });
        results.sessionCreation = {
          success: true,
          sessionId: sessionId.sessionId
        };
        
        // Clean up test session
        await prisma.userSession.delete({
          where: { id: sessionId.id }
        });
      } else {
        results.sessionCreation = {
          success: false,
          error: 'No users found'
        };
      }
    } catch (error) {
      results.sessionCreation = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
    
    console.log('📊 Database schema check results:', results);
    
    return NextResponse.json({
      success: true,
      message: 'Database schema check completed',
      results: results
    });
  } catch (error) {
    console.error('❌ Database schema check failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Database schema check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
