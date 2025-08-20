import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { kvGet, kvSet } from '@/lib/db-utils';

const STRUCTURE_FILE = path.join(process.cwd(), 'data', 'approach-structure.json');
const KV_KEY = 'approach-structure';

async function readStructure() {
  // Try KV first
  try {
    const kv = await kvGet<any[]>(KV_KEY, null as any);
    if (kv) return kv;
  } catch {}
  // Fallback to file
  try {
    const raw = await fs.readFile(STRUCTURE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e: any) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

async function writeStructure(structure: any[]) {
  // KV first
  try { await kvSet(KV_KEY, structure); } catch {}
  // File best-effort
  try {
    await fs.mkdir(path.dirname(STRUCTURE_FILE), { recursive: true });
    await fs.writeFile(STRUCTURE_FILE, JSON.stringify(structure, null, 2), 'utf-8');
  } catch {}
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
