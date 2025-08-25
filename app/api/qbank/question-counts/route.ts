import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { kvGet } from '@/lib/db-utils';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth-utils';

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

    // If no sources are selected, return 0 for all topics
    if (selectedSources.length === 0) {
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

    // Filter by sources
    let filtered = all as any[];
    filtered = filtered.filter(q => selectedSources.includes(q.source));

    // If question mode is not 'all' and we have a userId, filter based on user responses
    if (questionMode !== 'all' && userId) {
      const questionIds = filtered.map(q => q.id.toString());
      
      console.log(`🔍 Question counts API - Mode: ${questionMode}, User: ${userId}`);
      console.log(`📊 Total questions from sources: ${questionIds.length}`);
      
      try {
        // Verify the user token
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
          console.log('❌ No authorization token');
          throw new Error('No authorization token');
        }
        
        const user = await verifyToken(token);
        if (!user || user.id !== userId) {
          console.log('❌ Invalid user or token');
          throw new Error('Invalid user');
        }
        
        console.log('✅ User authenticated successfully');
        
                 // Get user responses directly from database
         const responses = await prisma.userResponse.findMany({
           where: {
             userId: userId,
             questionId: {
               in: questionIds
             }
           }
         });
         
         console.log(`📝 Found ${responses.length} user responses for these questions`);
         console.log(`📊 Sample responses:`, responses.slice(0, 3));
        
        // Create a map of questionId to response
        const responseMap = responses.reduce((acc, response) => {
          acc[response.questionId] = response;
          return acc;
        }, {} as Record<string, any>);
        
                 // Filter questions based on mode
         let filteredQuestionIds: string[] = [];
         
         switch (questionMode) {
           case 'unused':
             // Return questions that user hasn't answered
             filteredQuestionIds = questionIds.filter(id => !responseMap[id]);
             console.log(`🆕 Unused questions: ${filteredQuestionIds.length}`);
             console.log(`🆕 Sample unused question IDs:`, filteredQuestionIds.slice(0, 3));
             break;
           case 'incorrect':
             // Return questions that user answered incorrectly
             filteredQuestionIds = questionIds.filter(id => 
               responseMap[id] && !responseMap[id].isCorrect
             );
             console.log(`❌ Incorrect questions: ${filteredQuestionIds.length}`);
             console.log(`❌ Sample incorrect question IDs:`, filteredQuestionIds.slice(0, 3));
             break;
           case 'flagged':
             // Return questions that user flagged
             filteredQuestionIds = questionIds.filter(id => 
               responseMap[id] && responseMap[id].isFlagged
             );
             console.log(`🚩 Flagged questions: ${filteredQuestionIds.length}`);
             console.log(`🚩 Sample flagged question IDs:`, filteredQuestionIds.slice(0, 3));
             console.log(`🚩 Response map with flagged questions:`, Object.entries(responseMap).filter(([id, response]) => response.isFlagged).slice(0, 3));
             break;
           default:
             // Default to 'all'
             filteredQuestionIds = questionIds;
             console.log(`📋 All questions: ${filteredQuestionIds.length}`);
         }
        
        // Filter questions to only include those that match the mode
        filtered = filtered.filter((q: any) => 
          filteredQuestionIds.includes(q.id.toString())
        );
        
        console.log(`✅ Final filtered questions: ${filtered.length}`);
        
      } catch (error) {
        console.error('❌ Error fetching user responses for counts:', error);
        // If we can't get user responses, return 0 for all topics
        const topicCounts: Record<string, number> = {};
        if (selectedTopics.length > 0) {
          for (const topic of selectedTopics) {
            topicCounts[topic] = 0;
          }
        } else {
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
