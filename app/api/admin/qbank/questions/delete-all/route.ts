import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { kvGet, kvSet } from '@/lib/db-utils';

const QUESTIONS_FILE = path.join(process.cwd(), 'data', 'qbank-questions.json');
const KV_KEY = 'qbank-questions';

async function readAll() {
  // Try KV first
  try {
    const kv = await kvGet<any[]>(KV_KEY, null as any);
    if (kv) return kv;
  } catch {}
  // Fallback to file
  try {
    const raw = await fs.readFile(QUESTIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e: any) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

async function writeAll(list: any[]) {
  // KV first
  try { await kvSet(KV_KEY, list); } catch {}
  // File best-effort
  try {
    await fs.mkdir(path.dirname(QUESTIONS_FILE), { recursive: true });
    await fs.writeFile(QUESTIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch {}
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || '';
    const lecture = searchParams.get('lecture') || '';
    const topic = searchParams.get('topic') || '';
    const sourceKey = searchParams.get('sourceKey') || '';

    if (!subject || !lecture || !topic) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const all = await readAll();
    let filtered = all as any[];
    
    // Filter questions to delete
    filtered = filtered.filter(q => {
      const subjectMatch = (q.subject || '').toLowerCase() === subject.toLowerCase();
      const lectureMatch = (q.lecture || '').toLowerCase() === lecture.toLowerCase();
      const topicMatch = (q.topic || '').toLowerCase() === topic.toLowerCase();
      const sourceMatch = sourceKey ? (q.sourceKey || '') === sourceKey : true;
      
      return !(subjectMatch && lectureMatch && topicMatch && sourceMatch);
    });

    await writeAll(filtered);
    
    const deletedCount = all.length - filtered.length;
    return NextResponse.json({ 
      ok: true, 
      deletedCount,
      message: `Deleted ${deletedCount} questions for ${topic}`
    });
  } catch (error) {
    console.error('Error deleting questions:', error);
    return NextResponse.json({ error: 'Failed to delete questions' }, { status: 500 });
  }
}
