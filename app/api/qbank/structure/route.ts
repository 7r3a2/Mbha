import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/lib/repositories/kv.repository';

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
  const kv = await kvGet<any>(KV_KEY, null as any);
  return normalizeStructure(kv);
}

async function writeStructure(structure: any) {
  const normalized = normalizeStructure(structure);
  await kvSet(KV_KEY, normalized);
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
