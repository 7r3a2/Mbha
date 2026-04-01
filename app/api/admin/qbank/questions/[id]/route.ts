import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/lib/repositories/kv.repository';

const KV_KEY = 'qbank-questions';

async function readAll() {
  const kv = await kvGet<any[]>(KV_KEY, null as any);
  return kv || [];
}

async function writeAll(list: any[]) {
  await kvSet(KV_KEY, list);
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
