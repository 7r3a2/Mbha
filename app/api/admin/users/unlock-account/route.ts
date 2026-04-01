import { NextRequest, NextResponse } from 'next/server';
import { unlockUserAccount, deactivateAllUserSessions } from '@/lib/session-utils';
import { findUserById } from '@/lib/repositories/user.repository';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await findUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    await unlockUserAccount(userId);
    await deactivateAllUserSessions(userId);

    return NextResponse.json({
      success: true,
      message: 'Account unlocked successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to unlock account' },
      { status: 500 }
    );
  }
}
