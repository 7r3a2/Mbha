import { NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';
import { UserRole } from '@/lib/types/user';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST() {
  try {
    const guestId = `guest_${crypto.randomUUID()}`;

    const token = signToken(
      { userId: guestId, role: UserRole.GUEST },
      '24h'
    );

    // Track guest count in KV store
    try {
      const existing = await prisma.keyValue.findUnique({ where: { key: 'guest_count' } });
      const currentCount = existing ? (existing.value as { count: number }).count : 0;
      await prisma.keyValue.upsert({
        where: { key: 'guest_count' },
        update: { value: { count: currentCount + 1 } },
        create: { key: 'guest_count', value: { count: 1 } },
      });
    } catch {
      // Don't block guest login if tracking fails
    }

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
