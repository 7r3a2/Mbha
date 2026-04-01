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
    return NextResponse.json({ error: 'Failed to delete questions' }, { status: 500 });
  }
}
