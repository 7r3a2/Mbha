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
    const questionMode = searchParams.get('questionMode') || 'all';
    const userId = searchParams.get('userId');

    const selectedSources = sourcesParam.split(',').map(s => s.trim()).filter(Boolean);
    const selectedTopics = topicsParam.split(',').map(t => t.trim()).filter(Boolean);

    const all = await readQuestions();

    // Filter by sources if provided
    let filtered = all as any[];
    if (selectedSources.length > 0) {
      filtered = filtered.filter(q => selectedSources.includes(q.source));
    }

    // If question mode is not 'all' and we have a userId, filter based on user responses
    if (questionMode !== 'all' && userId) {
      const questionIds = filtered.map(q => q.id.toString());
      
      // Get user responses for these questions
      const userResponseParams = new URLSearchParams({
        questionIds: questionIds.join(','),
        mode: questionMode
      });
      
      try {
        const userResponseRes = await fetch(`${request.nextUrl.origin}/api/qbank/user-responses?${userResponseParams}`, {
          headers: {
            'Authorization': `Bearer ${request.headers.get('authorization') || ''}`
          }
        });
        
        if (userResponseRes.ok) {
          const userResponseData = await userResponseRes.json();
          const filteredQuestionIds = userResponseData.filteredQuestionIds || [];
          
          // Filter questions to only include those that match the mode
          filtered = filtered.filter((q: any) => 
            filteredQuestionIds.includes(q.id.toString())
          );
        }
      } catch (error) {
        console.error('Error fetching user responses for counts:', error);
        // If we can't get user responses, return 0 for all topics
        const topicCounts: Record<string, number> = {};
        if (selectedTopics.length > 0) {
          for (const topic of selectedTopics) {
            topicCounts[topic] = 0;
          }
        } else {
          // Get all unique topics and set count to 0
          const allTopics = new Set(all.map(q => q.topic).filter(Boolean));
          for (const topic of allTopics) {
            topicCounts[topic] = 0;
          }
        }
        return NextResponse.json({ topicCounts });
      }
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
