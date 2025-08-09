import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { findUserById } from '@/lib/db-utils';
import { promises as fs } from 'fs';
import path from 'path';

const SUBS_FILE = path.join(process.cwd(), 'data', 'subscriptions.json');

async function readSubs(): Promise<Record<string, { expiresAt: string }>> {
  try {
    const raw = await fs.readFile(SUBS_FILE, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch (e: any) {
    if (e.code === 'ENOENT') return {};
    throw e;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) return NextResponse.json({ valid: false }, { status: 200 });

    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch {
      return NextResponse.json({ valid: false }, { status: 200 });
    }

    const user = await findUserById(payload.userId);
    if (!user) return NextResponse.json({ valid: false }, { status: 200 });

    // Compute trial and subscription
    const createdAt = new Date(user.createdAt as any);
    const now = new Date();
    const trialEnds = new Date(createdAt);
    trialEnds.setDate(trialEnds.getDate() + 3);
    const trialActive = now < trialEnds;

    const subs = await readSubs();
    const sub = subs[user.id];
    const subActive = sub ? now < new Date(sub.expiresAt) : false;

    // Effective access: trial OR active subscription grants all; otherwise only wizary
    const hasFullAccess = trialActive || subActive;
    const effectiveUser = {
      ...user,
      hasWizaryExamAccess: true,
      hasApproachAccess: hasFullAccess,
      hasQbankAccess: hasFullAccess,
      hasCoursesAccess: hasFullAccess,
      subscriptionActive: subActive,
      subscriptionExpiresAt: sub?.expiresAt || null,
      trialActive,
      trialEndsAt: trialEnds.toISOString(),
    } as any;

    return NextResponse.json({ valid: true, user: effectiveUser });
  } catch (e) {
    return NextResponse.json({ valid: false }, { status: 200 });
  }
}

 