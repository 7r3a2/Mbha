import { NextRequest, NextResponse } from 'next/server';
import { getAllExams, createExam } from '@/lib/repositories/exam.repository';

export async function GET(request: NextRequest) {
  try {
    const exams = await getAllExams();
    return NextResponse.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Received exam creation request');
    const examData = await request.json();
    console.log('📊 Exam data:', {
      title: examData.title,
      subject: examData.subject,
      examTime: examData.examTime,
      secretCode: examData.secretCode,
      questionsLength: examData.questions?.length || 'N/A'
    });
    
    if (!examData.title || !examData.subject || !examData.questions) {
      console.log('❌ Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'Title, subject, and questions are required' },
        { status: 400 }
      );
    }

    console.log('💾 Creating exam in database...');
    const exam = await createExam({
      title: examData.title,
      subject: examData.subject,
      examTime: examData.examTime || 180,
      secretCode: examData.secretCode || 'HaiderAlaa',
      questions: examData.questions,
    });

    console.log('✅ Exam created successfully:', exam.id);
    return NextResponse.json(exam);
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json(
      { error: 'Failed to create exam' },
      { status: 500 }
    );
  }
}