import { NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';
import { UserRole } from '@/lib/types/user';
import crypto from 'crypto';

export async function POST() {
  try {
    const guestId = `guest_${crypto.randomUUID()}`;

    const token = signToken(
      { userId: guestId, role: UserRole.GUEST },
      '24h'
    );

    return NextResponse.json({
      token,
      user: {
        id: guestId,
        firstName: 'Guest',
        lastName: '',
        email: '',
        role: 'guest',
        hasWizaryExamAccess: true,
        hasApproachAccess: false,
        hasQbankAccess: false,
        hasCoursesAccess: false,
        isGuest: true,
      },
    });
  } catch (error) {
    // Guest login error
    return NextResponse.json(
      { error: 'Failed to create guest session' },
      { status: 500 }
    );
  }
}
