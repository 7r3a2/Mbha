import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { kvGet, kvSet } from '@/lib/db-utils';

const STRUCTURE_FILE = path.join(process.cwd(), 'data', 'qbank-structure.json');
const KV_KEY = 'qbank-structure';

function normalizeStructure(data: any): { subjects: any[] } {
  if (!data) return { subjects: [] };
  if (Array.isArray(data)) return { subjects: data };
  if (data.subjects && Array.isArray(data.subjects)) return { subjects: data.subjects };
  return { subjects: [] };
}

function toLabelShape(subjects: any[]): any[] {
  return (subjects || []).map((s: any) => ({
    key: s.key || s.id || `${Date.now()}_${Math.random()}`,
    id: s.id || s.key || undefined,
    label: s.label || s.name || 'Subject',
    color: s.color || '#0072b7',
    sources: (s.sources || []).map((src: any) => ({
      key: src.key || src.id || `${Date.now()}_${Math.random()}`,
      id: src.id || src.key || undefined,
      label: src.label || src.name || 'Source'
    })),
    lectures: (s.lectures || []).map((lec: any) => ({
      title: lec.title || lec.name || 'Lecture',
      topics: (lec.topics || []).map((t: any) => (typeof t === 'string' ? t : (t.title || t.name || 'Topic')))
    }))
  }));
}

async function readStructure() {
  // Prefer KV
  try {
    const kv = await kvGet<any>(KV_KEY, null as any);
    if (kv) return normalizeStructure(kv);
  } catch {}
  // Fallback to file
  try {
    const raw = await fs.readFile(STRUCTURE_FILE, 'utf-8');
    return normalizeStructure(JSON.parse(raw));
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      const defaultStructure = {
        subjects: []
      };
      await writeStructure(defaultStructure);
      return defaultStructure;
    }
    throw e;
  }
}

async function writeStructure(structure: any) {
  const normalized = normalizeStructure(structure);
  // KV first
  try { await kvSet(KV_KEY, normalized); } catch {}
  // File best-effort
  try {
    await fs.mkdir(path.dirname(STRUCTURE_FILE), { recursive: true });
    await fs.writeFile(STRUCTURE_FILE, JSON.stringify(normalized, null, 2), 'utf-8');
  } catch {}
}

export async function GET() {
  try {
    const structure = await readStructure();
    const subjects = toLabelShape(structure.subjects);
    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load structure' }, { status: 500 });
  }
}

// Replace full structure (simple admin management)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await writeStructure(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save structure' }, { status: 500 });
  }
}
