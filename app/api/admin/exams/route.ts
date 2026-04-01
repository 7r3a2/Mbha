import { NextRequest, NextResponse } from 'next/server';
import { getAllExams, createExam } from '@/lib/repositories/exam.repository';

export async function GET(request: NextRequest) {
  try {
    const exams = await getAllExams();
    return NextResponse.json(exams);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const examData = await request.json();

    if (!examData.title || !examData.subject || !examData.questions) {
      return NextResponse.json(
        { error: 'Title, subject, and questions are required' },
        { status: 400 }
      );
    }

    const exam = await createExam({
      title: examData.title,
      subject: examData.subject,
      examTime: examData.examTime || 180,
      secretCode: examData.secretCode || 'HaiderAlaa',
      questions: examData.questions,
    });

    return NextResponse.json(exam);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create exam' },
      { status: 500 }
    );
  }
}