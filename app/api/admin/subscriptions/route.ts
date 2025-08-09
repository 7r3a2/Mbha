import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { kvGet, kvSet } from '@/lib/db-utils';

const SUBS_FILE = path.join(process.cwd(), 'data', 'subscriptions.json');
const KV_KEY = 'subscriptions';

async function readSubs(): Promise<Record<string, { expiresAt: string }>> {
  try {
    // Prefer KV (Postgres)
    const kv = await kvGet<Record<string, { expiresAt: string }>>(KV_KEY, null as any);
    if (kv) return kv;
  } catch {}
  // Fallback to local file
  try {
    const raw = await fs.readFile(SUBS_FILE, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch (e: any) {
    if (e.code === 'ENOENT') return {};
    throw e;
  }
}

async function writeSubs(data: Record<string, { expiresAt: string }>) {
  // Write both KV and file (best-effort)
  try { await kvSet(KV_KEY, data); } catch {}
  try {
    await fs.mkdir(path.dirname(SUBS_FILE), { recursive: true });
    await fs.writeFile(SUBS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {}
}

export async function GET() {
  const subs = await readSubs();
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
    const subs = await readSubs();
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
    subs[userId] = { expiresAt: expires.toISOString() };
    await writeSubs(subs);
    return NextResponse.json({ ok: true, userId, expiresAt: subs[userId].expiresAt });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
    
    const subs = await readSubs();
    delete subs[userId];
    await writeSubs(subs);
    return NextResponse.json({ ok: true, userId });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to remove subscription' }, { status: 500 });
  }
}


