import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const QUESTIONS_FILE = path.join(process.cwd(), 'data', 'qbank-questions.json');

async function readQuestions(): Promise<any[]> {
  try {
    const data = await fs.readFile(QUESTIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e: any) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sourcesParam = searchParams.get('sources') || '';
    const topicsParam = searchParams.get('topics') || '';
    const singleTopic = searchParams.get('topic') || '';
    const count = parseInt(searchParams.get('count') || searchParams.get('limit') || '20', 10);

    const selectedSources = sourcesParam.split(',').map(s => s.trim()).filter(Boolean);
    const selectedTopics = (topicsParam || singleTopic).split(',').map(t => t.trim()).filter(Boolean);

    const all = await readQuestions();

    // Filter by sources/topics if provided
    let filtered = all as any[];
    if (selectedSources.length > 0) {
      filtered = filtered.filter(q => selectedSources.includes(q.source));
    }
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(q => selectedTopics.includes(q.topic));
    }

    // If no topics specified, just return a randomized slice
    if (selectedTopics.length === 0) {
      const limited = shuffle(filtered).slice(0, Math.max(0, count));
      const transformed = limited.map((q, idx) => ({
        id: q.id ?? idx + 1,
        text: q.text,
        options: q.options ?? [],
        correct: typeof q.correct === 'number' ? q.correct : 0,
        source: q.source ?? '',
        explanation: {
          correct: q.explanation?.correct ?? '',
          incorrect: Array.isArray(q.explanation?.incorrect) ? q.explanation.incorrect : [],
          objective: q.explanation?.objective ?? ''
        }
      }));
      return NextResponse.json({ questions: transformed });
    }

    // Enforce no repeats and respect per-topic availability
    const byTopic: Record<string, any[]> = {};
    for (const t of selectedTopics) byTopic[t] = [];
    for (const q of filtered) {
      if (byTopic[q.topic]) byTopic[q.topic].push(q);
    }

    // Shuffle each topic bucket
    Object.keys(byTopic).forEach(t => { byTopic[t] = shuffle(byTopic[t]); });

    // Determine how many to take without exceeding available
    const totalAvailable = Object.values(byTopic).reduce((sum, arr) => sum + arr.length, 0);
    const target = Math.min(count, totalAvailable);

    // Distribute fairly across topics without replacement
    const result: any[] = [];
    let idx = 0;
    while (result.length < target) {
      const t = selectedTopics[idx % selectedTopics.length];
      const bucket = byTopic[t];
      if (bucket && bucket.length > 0) {
        result.push(bucket.shift());
      }
      idx++;
      if (idx > selectedTopics.length * (target + 1)) break;
    }

    const transformed = result.map((q, i) => ({
      id: q.id ?? i + 1,
      text: q.text,
      options: q.options ?? [],
      correct: typeof q.correct === 'number' ? q.correct : 0,
      source: q.source ?? '',
      explanation: {
        correct: q.explanation?.correct ?? '',
        incorrect: Array.isArray(q.explanation?.incorrect) ? q.explanation.incorrect : [],
        objective: q.explanation?.objective ?? ''
      }
    }));

    return NextResponse.json({ questions: transformed });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}
