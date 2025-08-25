import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Testing database connection...');
    
    // Simple database connection test
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query result:', result);
    
    // Try to count users
    const userCount = await prisma.user.count();
    console.log('✅ User count:', userCount);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount: userCount,
      testResult: result
    });
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return NextResponse.json(
      { 
        error: 'Database test failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
