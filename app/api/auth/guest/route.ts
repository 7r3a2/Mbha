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

    // Track unique devices (IP + User-Agent = device fingerprint)
    try {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';

      // Hash IP + User-Agent to create a unique device fingerprint
      const fingerprint = crypto.createHash('sha256').update(`${ip}|${userAgent}`).digest('hex');

      const existing = await prisma.keyValue.findUnique({ where: { key: 'guest_devices' } });
      const devices: string[] = existing
        ? (existing.value as { devices: string[] }).devices
        : [];

      if (!devices.includes(fingerprint)) {
        devices.push(fingerprint);
        await prisma.keyValue.upsert({
          where: { key: 'guest_devices' },
          update: { value: { devices } },
          create: { key: 'guest_devices', value: { devices } },
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
