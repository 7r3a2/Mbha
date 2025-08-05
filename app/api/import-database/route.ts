import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth-utils';

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
    const body = await request.json();
    const { data } = body;
    
    if (!data) {
      return NextResponse.json({
        success: false,
        message: 'No data provided for import'
      }, { status: 400 });
    }
    
    console.log('🔄 Importing database data...');
    
    const { users, codes, exams } = data;
    
    console.log(`📊 Importing ${users?.length || 0} users...`);
    console.log(`🔑 Importing ${codes?.length || 0} codes...`);
    console.log(`📝 Importing ${exams?.length || 0} exams...`);
    
    // Import users
    if (users && users.length > 0) {
      for (const user of users) {
        try {
          await prisma.user.upsert({
            where: { email: user.email },
            update: user,
            create: user
          });
        } catch (error) {
          console.log(`⚠️  Skipping user ${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }
    
    // Import codes
    if (codes && codes.length > 0) {
      for (const code of codes) {
        try {
          await prisma.uniqueCode.upsert({
            where: { code: code.code },
            update: code,
            create: code
          });
        } catch (error) {
          console.log(`⚠️  Skipping code ${code.code}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }
    
    // Import exams
    if (exams && exams.length > 0) {
      for (const exam of exams) {
        try {
          await prisma.exam.upsert({
            where: { id: exam.id },
            update: exam,
            create: exam
          });
        } catch (error) {
          console.log(`⚠️  Skipping exam ${exam.title}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }
    
    console.log('✅ Database import completed successfully!');
    
    return NextResponse.json({
      success: true,
      message: 'Database imported successfully',
      summary: {
        users: users?.length || 0,
        codes: codes?.length || 0,
        exams: exams?.length || 0
      }
    });
    
  } catch (error) {
    console.error('❌ Error importing database:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to import database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 