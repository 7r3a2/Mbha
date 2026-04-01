import { NextRequest, NextResponse } from 'next/server';
import { verifyUserToken } from '@/lib/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) return NextResponse.json({ valid: false });

    const result = await verifyUserToken(token);
    if (!result) return NextResponse.json({ valid: false });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ valid: false });
  }
}
