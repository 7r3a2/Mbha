import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { kvGet } from '@/lib/db-utils';

const QUESTIONS_FILE = path.join(process.cwd(), 'data', 'qbank-questions.json');
const KV_KEY = 'qbank-questions';

async function readQuestions(): Promise<any[]> {
  // KV first
  try {
    const kv = await kvGet<any[]>(KV_KEY, null as any);
    if (kv) return kv;
  } catch {}
  // Fallback to file
  try {
    const data = await fs.readFile(QUESTIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e: any) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sourcesParam = searchParams.get('sources') || '';
    const topicsParam = searchParams.get('topics') || '';

    const selectedSources = sourcesParam.split(',').map(s => s.trim()).filter(Boolean);
    const selectedTopics = topicsParam.split(',').map(t => t.trim()).filter(Boolean);

    const all = await readQuestions();

    // Filter by sources if provided
    let filtered = all as any[];
    if (selectedSources.length > 0) {
      filtered = filtered.filter(q => selectedSources.includes(q.source));
    }

    // Count questions by topic
    const topicCounts: Record<string, number> = {};
    
    if (selectedTopics.length > 0) {
      // Count only for specified topics
      for (const topic of selectedTopics) {
        topicCounts[topic] = filtered.filter(q => q.topic === topic).length;
      }
    } else {
      // Count for all topics
      for (const question of filtered) {
        const topic = question.topic;
        if (topic) {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        }
      }
    }

    return NextResponse.json({ topicCounts });
  } catch (error) {
    console.error('Error fetching question counts:', error);
    return NextResponse.json({ error: 'Failed to fetch question counts' }, { status: 500 });
  }
}
