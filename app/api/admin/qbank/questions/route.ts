import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const QUESTIONS_FILE = path.join(process.cwd(), 'data', 'qbank-questions.json');

async function readAll() {
  try {
    const raw = await fs.readFile(QUESTIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e: any) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

async function writeAll(list: any[]) {
  await fs.mkdir(path.dirname(QUESTIONS_FILE), { recursive: true });
  await fs.writeFile(QUESTIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || '';
    const source = searchParams.get('source') || '';
    const sourceKey = searchParams.get('sourceKey') || '';
    const topic = searchParams.get('topic') || '';

    const all = await readAll();
    let filtered = all as any[];
    if (subject) filtered = filtered.filter(q => (q.subject || '').toLowerCase() === subject.toLowerCase());
    // Prefer filtering by stable sourceKey when provided; fallback to label
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
    // minimal validation
    if (!body || !body.text || !Array.isArray(body.options) || body.options.length < 2) {
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
      text: body.text,
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
