import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Checking production database users...');
    
    // Check if we're connected to production database
    const dbUrl = process.env.PRISMA_DATABASE_URL;
    const isProduction = dbUrl?.includes('prisma-data.net') || dbUrl?.includes('db.prisma.io');
    
    console.log('🌐 Database URL type:', isProduction ? 'PRODUCTION' : 'LOCAL');
    
    // Get user count
    const userCount = await prisma.user.count();
    
    // Get all users (without passwords)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isLocked: true,
        hasQbankAccess: true,
        hasWizaryExamAccess: true,
        hasApproachAccess: true,
        hasCoursesAccess: true,
        uniqueCode: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      isProduction,
      userCount,
      users,
      databaseUrl: dbUrl ? 'Connected' : 'Not set'
    });
  } catch (error) {
    console.error('❌ Error checking production users:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
