import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/lib/repositories/kv.repository';

const KV_KEY = 'approach-structure';

async function readStructure() {
  const kv = await kvGet<any[]>(KV_KEY, null as any);
  return kv || [];
}

async function writeStructure(structure: any[]) {
  await kvSet(KV_KEY, structure);
}

export async function GET() {
  try {
    const structure = await readStructure();
    return NextResponse.json(structure);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load approach structure' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const structure = await request.json();
    await writeStructure(structure);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update approach structure' }, { status: 500 });
  }
}
