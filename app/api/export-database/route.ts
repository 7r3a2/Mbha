import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth-utils';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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
    console.log('🔄 Exporting database data...');
    
    // Export users
    const users = await prisma.user.findMany();
    console.log(`📊 Found ${users.length} users`);
    
    // Export unique codes
    const codes = await prisma.uniqueCode.findMany();
    console.log(`🔑 Found ${codes.length} codes`);
    
    // Export exams
    const exams = await prisma.exam.findMany();
    console.log(`📝 Found ${exams.length} exams`);
    
    // Create export object
    const exportData = {
      users: users.map(user => ({
        ...user,
        password: user.password // Keep encrypted passwords
      })),
      codes: codes,
      exams: exams,
      exportDate: new Date().toISOString()
    };
    
    console.log('✅ Database export completed');
    
    return NextResponse.json({
      success: true,
      message: 'Database exported successfully',
      data: exportData,
      summary: {
        users: users.length,
        codes: codes.length,
        exams: exams.length
      }
    });
    
  } catch (error) {
    console.error('❌ Error exporting database:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to export database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 