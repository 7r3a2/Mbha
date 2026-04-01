import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Count unique devices, fallback to old guest_ips key
    const devicesRecord = await prisma.keyValue.findUnique({ where: { key: 'guest_devices' } });
    if (devicesRecord) {
      const count = (devicesRecord.value as { devices: string[] }).devices.length;
      return NextResponse.json({ count });
    }
    const record = await prisma.keyValue.findUnique({ where: { key: 'guest_ips' } });
    const count = record ? (record.value as { ips: string[] }).ips.length : 0;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
