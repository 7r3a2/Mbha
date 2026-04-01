import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';
import { UserRole } from '@/lib/types/user';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const guestId = `guest_${crypto.randomUUID()}`;

    const token = signToken(
      { userId: guestId, role: UserRole.GUEST },
      '24h'
    );

    // Track unique guest IPs
    try {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';

      const existing = await prisma.keyValue.findUnique({ where: { key: 'guest_ips' } });
      const ips: string[] = existing ? (existing.value as { ips: string[] }).ips : [];

      if (!ips.includes(ip)) {
        ips.push(ip);
        await prisma.keyValue.upsert({
          where: { key: 'guest_ips' },
          update: { value: { ips } },
          create: { key: 'guest_ips', value: { ips } },
        });
      }
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
    return NextResponse.json(
      { error: 'Failed to create guest session' },
      { status: 500 }
    );
  }
}
