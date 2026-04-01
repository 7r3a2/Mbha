import { NextRequest, NextResponse } from 'next/server';
import { loginUser, ServiceError } from '@/lib/services/auth.service';
import { validateLoginInput } from '@/lib/validation';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 attempts per 15 minutes per IP
    const ip = getClientIp(request);
    const rateLimitResult = await rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${rateLimitResult.retryAfter} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Input validation
    const validation = validateLoginInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: Object.values(validation.errors)[0] },
        { status: 400 }
      );
    }

    const result = await loginUser(body.email, body.password);
    return NextResponse.json(result);
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

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
