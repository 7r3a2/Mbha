import { NextRequest, NextResponse } from 'next/server';
import {
  getSubscriptions,
  setUserSubscription,
  removeUserSubscription,
} from '@/lib/repositories/subscription.repository';

export async function GET() {
  const subs = await getSubscriptions();
  return NextResponse.json(subs);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId as string;
    const months = body.months as number | undefined;
    const amount = body.amount as number | undefined;
    const unit = (body.unit as string | undefined)?.toLowerCase();
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
    if (!months && !(amount && unit)) {
      return NextResponse.json({ error: 'Provide months OR amount+unit' }, { status: 400 });
    }
    const now = new Date();
    const expires = new Date(now);
    if (months && months > 0) {
      expires.setMonth(expires.getMonth() + months);
    } else if (amount && amount > 0 && unit) {
      switch (unit) {
        case 'day':
        case 'days':
          expires.setDate(expires.getDate() + amount);
          break;
        case 'week':
        case 'weeks':
          expires.setDate(expires.getDate() + amount * 7);
          break;
        case 'month':
        case 'months':
          expires.setMonth(expires.getMonth() + amount);
          break;
        case 'year':
        case 'years':
          expires.setFullYear(expires.getFullYear() + amount);
          break;
        default:
          return NextResponse.json({ error: 'Invalid unit. Use day/week/month/year' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid duration' }, { status: 400 });
    }
    const expiresAt = expires.toISOString();
    await setUserSubscription(userId, expiresAt);
    return NextResponse.json({ ok: true, userId, expiresAt });
  } catch {
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    await removeUserSubscription(userId);
    return NextResponse.json({ ok: true, userId });
  } catch {
    return NextResponse.json({ error: 'Failed to remove subscription' }, { status: 500 });
  }
}
