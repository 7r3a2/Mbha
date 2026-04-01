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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || '';
    const lecture = searchParams.get('lecture') || '';
    const source = searchParams.get('source') || '';
    const sourceKey = searchParams.get('sourceKey') || '';
    const topic = searchParams.get('topic') || '';

    const all = await readAll();
    let filtered = all as any[];
    if (subject) filtered = filtered.filter(q => (q.subject || '').toLowerCase() === subject.toLowerCase());
    if (lecture) filtered = filtered.filter(q => (q.lecture || '').toLowerCase() === lecture.toLowerCase());
    if (sourceKey) filtered = filtered.filter(q => (q.sourceKey || '') === sourceKey);
    else if (source) filtered = filtered.filter(q => (q.source || '').toLowerCase() === source.toLowerCase());
    if (topic) filtered = filtered.filter(q => (q.topic || '').toLowerCase() === topic.toLowerCase());

    return NextResponse.json(filtered);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const questionText = body.text || body.question;
    if (!body || !questionText || !Array.isArray(body.options) || body.options.length < 2) {
      return NextResponse.json({ error: 'Invalid question payload' }, { status: 400 });
    }

    const list = await readAll();
    const maxId = list.reduce((m: number, q: any) => Math.max(m, Number(q.id) || 0), 0);
    const next = {
      id: maxId + 1,
      subject: body.subject || '',
      source: body.source || body.sourceLabel || '',
      sourceKey: body.sourceKey || '',
      topic: body.topic || '',
      text: questionText,
      options: body.options,
      correct: typeof body.correct === 'number' ? body.correct : 0,
      explanation: {
        correct: body.explanation?.correct || '',
        incorrect: Array.isArray(body.explanation?.incorrect) ? body.explanation.incorrect : [],
        objective: body.explanation?.objective || ''
      }
    };
    list.push(next);
    await writeAll(list);
    return NextResponse.json(next, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
