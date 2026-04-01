import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const record = await prisma.keyValue.findUnique({ where: { key: 'guest_ips' } });
    const count = record ? (record.value as { ips: string[] }).ips.length : 0;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
