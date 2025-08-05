import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  // Check if user is authenticated and is admin
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.uniqueCode || !decoded.uniqueCode.startsWith('ADMIN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { examId } = await request.json();
    
    if (!examId) {
      return NextResponse.json({ error: 'Exam ID is required' }, { status: 400 });
    }

    console.log('🗑️ Deleting exam from database:', examId);

    // Find the exam first
    const exam = await prisma.exam.findUnique({
      where: { id: examId }
    });
    
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Delete the exam
    await prisma.exam.delete({
      where: { id: examId }
    });

    console.log('✅ Exam deleted successfully from database');

    return NextResponse.json({ 
      message: 'Exam deleted successfully',
      deletedExam: {
        id: exam.id,
        title: exam.title,
        subject: exam.subject
      }
    });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 