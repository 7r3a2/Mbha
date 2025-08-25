import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkUserSessions } from '@/lib/session-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    console.log('🔍 Checking sessions for user:', email);
    
    // Find user
    const user = await prisma.user.findFirst({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      });
    }

    // Check sessions
    const { activeSessions, shouldLock } = await checkUserSessions(user.id);
    
    // Get all sessions for this user
    const allSessions = await prisma.userSession.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        sessionId: true,
        isActive: true,
        createdAt: true,
        expiresAt: true,
        deviceInfo: true,
        ipAddress: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('📊 Sessions found:', {
      userId: user.id,
      email: user.email,
      isLocked: user.isLocked,
      activeSessions,
      shouldLock,
      totalSessions: allSessions.length
    });

    return NextResponse.json({
      success: true,
      message: 'User sessions retrieved',
      user: {
        id: user.id,
        email: user.email,
        isLocked: user.isLocked
      },
      sessions: {
        activeSessions,
        shouldLock,
        totalSessions: allSessions.length,
        allSessions: allSessions
      }
    });
  } catch (error) {
    console.error('❌ Error checking user sessions:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to check user sessions',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
