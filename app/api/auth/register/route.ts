import { NextRequest, NextResponse } from 'next/server';
import { registerUser, ServiceError } from '@/lib/services/auth.service';
import { validateRegistration } from '@/lib/validation';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 attempts per hour per IP
    const ip = getClientIp(request);
    const rateLimitResult = rateLimit(`register:${ip}`, 3, 60 * 60 * 1000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Try again in ${rateLimitResult.retryAfter} seconds.` },
        { status: 429 }
      );
    }

    const data = await request.json();

    // Input validation
    const validation = validateRegistration(data);
    if (!validation.valid) {
      return NextResponse.json(
        { error: Object.values(validation.errors)[0], errors: validation.errors },
        { status: 400 }
      );
    }

    const result = await registerUser(data);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ServiceError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    const err = error as { code?: string; message?: string };
    if (err.code === 'P1001' || err.message?.includes('connection')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
