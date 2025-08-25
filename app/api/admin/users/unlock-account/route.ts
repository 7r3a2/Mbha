import { NextRequest, NextResponse } from 'next/server';
import { unlockUserAccount, deactivateAllUserSessions } from '@/lib/session-utils';
import { findUserById } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await findUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log(`🔓 Admin unlocking account for user: ${userId}`);

    // Unlock the user account
    await unlockUserAccount(userId);
    
    // Deactivate all existing sessions to force fresh login
    await deactivateAllUserSessions(userId);

    console.log(`✅ Account unlocked successfully for user: ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Account unlocked successfully'
    });
  } catch (error) {
    console.error('❌ Error unlocking account:', error);
    return NextResponse.json(
      { error: 'Failed to unlock account' },
      { status: 500 }
    );
  }
}
