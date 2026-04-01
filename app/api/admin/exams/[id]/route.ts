import { NextRequest, NextResponse } from 'next/server';
import { deleteExam } from '@/lib/repositories/exam.repository';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const examId = params.id;

    if (!examId) {
      return NextResponse.json({ error: 'Exam ID is required' }, { status: 400 });
    }

    await deleteExam(examId);

    return NextResponse.json({
      message: 'Exam deleted successfully from database',
      examId: examId
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const examId = params.id;
    const updateData = await request.json();

    if (!examId) {
      return NextResponse.json({ error: 'Exam ID is required' }, { status: 400 });
    }

    const updatedExam = await prisma.exam.update({
      where: { id: examId },
      data: {
        title: updateData.title,
        subject: updateData.subject,
        examTime: updateData.examTime,
        secretCode: updateData.secretCode,
        order: updateData.order,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Exam updated successfully in database',
      exam: updatedExam
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update exam' }, { status: 500 });
  }
}
