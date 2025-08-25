import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Clear all sessions for admin account
    const { prisma } = await import('@/lib/prisma');
    const { deactivateAllUserSessions } = await import('@/lib/session-utils');
    
    const adminUser = await prisma.user.findFirst({
      where: {
        email: 'admin@mbha.com'
      }
    });

    if (adminUser) {
      await deactivateAllUserSessions(adminUser.id);
      console.log('✅ All admin sessions cleared');
    }

    return NextResponse.json({
      success: true,
      message: 'All sessions cleared. You can now login again.'
    });
  } catch (error) {
    console.error('❌ Error clearing sessions:', error);
    return NextResponse.json(
      { error: 'Failed to clear sessions' },
      { status: 500 }
    );
  }
}
