import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
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
    const { examId, newOrder, subject } = await request.json();
    
    console.log('🔄 Reorder exam request received:', { examId, newOrder, subject });

    // Find the exam to reorder
    const exam = await prisma.exam.findUnique({
      where: { id: examId }
    });
    
    if (!exam) {
      console.error('❌ Exam not found with ID:', examId);
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Update the exam's order and subject if provided
    const updatedExam = await prisma.exam.update({
      where: { id: examId },
      data: {
        order: newOrder,
        subject: subject || exam.subject,
        updatedAt: new Date()
      }
    });

    console.log('✅ Exam reordered successfully in database');
    return NextResponse.json({ 
      message: 'تم إعادة ترتيب الامتحان بنجاح',
      examId: updatedExam.id,
      newOrder: updatedExam.order
    });
  } catch (error) {
    console.error('❌ Reorder exam error:', error);
    return NextResponse.json(
      { error: `حدث خطأ أثناء إعادة ترتيب الامتحان: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 