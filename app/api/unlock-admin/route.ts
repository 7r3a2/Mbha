import { NextRequest, NextResponse } from 'next/server';
import { unlockUserAccount, deactivateAllUserSessions } from '@/lib/session-utils';

export async function GET(request: NextRequest) {
  try {
    // Find admin account (assuming it's the one with admin@mbha.com email)
    const { prisma } = await import('@/lib/prisma');
    const adminUser = await prisma.user.findFirst({
      where: {
        email: 'admin@mbha.com'
      }
    });

    if (!adminUser) {
      return NextResponse.json({
        success: false,
        message: 'Admin user not found'
      });
    }

    console.log('🔓 Unlocking admin account:', adminUser.email);

    // Unlock the admin account
    await unlockUserAccount(adminUser.id);
    
    // Deactivate all existing sessions
    await deactivateAllUserSessions(adminUser.id);

    console.log('✅ Admin account unlocked successfully');

    return NextResponse.json({
      success: true,
      message: 'Admin account unlocked successfully',
      adminEmail: adminUser.email
    });
  } catch (error) {
    console.error('❌ Error unlocking admin account:', error);
    return NextResponse.json(
      { error: 'Failed to unlock admin account' },
      { status: 500 }
    );
  }
}
