import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { kvGet, kvSet } from '@/lib/db-utils';

const QUESTIONS_FILE = path.join(process.cwd(), 'data', 'qbank-questions.json');
const KV_KEY = 'qbank-questions';

async function readAll() {
  // KV first
  try {
    const kv = await kvGet<any[]>(KV_KEY, null as any);
    if (kv) return kv;
  } catch {}
  // File fallback
  try {
    const raw = await fs.readFile(QUESTIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e: any) {
    if (e.code === 'ENOENT') return [];
    return [];
  }
}

async function writeAll(list: any[]) {
  // KV first
  try { await kvSet(KV_KEY, list); } catch {}
  // File best-effort
  try {
    await fs.mkdir(path.dirname(QUESTIONS_FILE), { recursive: true });
    await fs.writeFile(QUESTIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e: any) {
    if (e?.code !== 'EROFS') {
      // ignore read-only on Vercel
    }
  }
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const list = await readAll();
  const item = list.find((q: any) => Number(q.id) === id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const payload = await request.json();
    const list = await readAll();
    const idx = list.findIndex((q: any) => Number(q.id) === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    list[idx] = {
      ...list[idx],
      subject: payload.subject ?? list[idx].subject,
      source: payload.source ?? list[idx].source,
      topic: payload.topic ?? list[idx].topic,
      text: payload.text ?? list[idx].text,
      options: Array.isArray(payload.options) ? payload.options : list[idx].options,
      correct: typeof payload.correct === 'number' ? payload.correct : list[idx].correct,
      explanation: {
        correct: payload.explanation?.correct ?? list[idx].explanation?.correct ?? '',
        incorrect: Array.isArray(payload.explanation?.incorrect) ? payload.explanation.incorrect : (list[idx].explanation?.incorrect ?? []),
        objective: payload.explanation?.objective ?? list[idx].explanation?.objective ?? ''
      }
    };

    await writeAll(list);
    return NextResponse.json(list[idx]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const list = await readAll();
  const next = list.filter((q: any) => Number(q.id) !== id);
  await writeAll(next);
  return NextResponse.json({ ok: true });
}
