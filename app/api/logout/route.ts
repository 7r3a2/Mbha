import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { deactivateAllUserSessions } from '@/lib/session-utils';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: true, message: 'Logged out' });
    }

    const payload = verifyToken(token);
    if (payload?.userId) {
      await deactivateAllUserSessions(payload.userId);
    }

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch {
    return NextResponse.json({ success: true, message: 'Logged out' });
  }
}
