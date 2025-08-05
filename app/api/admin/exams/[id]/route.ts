import { NextRequest, NextResponse } from 'next/server';
import { deleteExamAdmin } from '@/lib/db-utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const examId = params.id;
    
    if (!examId) {
      return NextResponse.json({ error: 'Exam ID is required' }, { status: 400 });
    }

    console.log('🗑️ Deleting exam from database:', examId);
    
    // Delete from database
    await deleteExamAdmin(examId);

    return NextResponse.json({ 
      message: 'Exam deleted successfully from database',
      examId: examId
    });
  } catch (error) {
    console.error('Error deleting exam from database:', error);
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

    console.log('✏️ Updating exam in database:', examId, updateData);
    
    // Update exam in database
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
    console.error('Error updating exam in database:', error);
    return NextResponse.json({ error: 'Failed to update exam' }, { status: 500 });
  }
}