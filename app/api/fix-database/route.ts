import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Checking database connection to find your 26 users...');
    
    // Check which database we're connected to
    const dbUrl = process.env.PRISMA_DATABASE_URL;
    console.log('🌐 Database URL type:', dbUrl?.includes('accelerate.prisma-data.net') ? 'Prisma Accelerate' : 'Direct PostgreSQL');
    
    // Try to get ALL users (maybe there's a filter issue)
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        hasQbankAccess: true,
        hasWizaryExamAccess: true,
        hasApproachAccess: true,
        hasCoursesAccess: true,
        isLocked: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const userCount = allUsers.length;
    
    // Check if there are any users with qbank access
    const qbankUsers = allUsers.filter(user => user.hasQbankAccess);
    
    // Check if there are any locked users
    const lockedUsers = allUsers.filter(user => user.isLocked);

    return NextResponse.json({
      success: true,
      totalUsers: userCount,
      qbankUsers: qbankUsers.length,
      lockedUsers: lockedUsers.length,
      allUsers: allUsers,
      databaseUrl: dbUrl ? 'Connected' : 'Not set',
      message: `Found ${userCount} users in database`
    });
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database connection failed'
    }, { status: 500 });
  }
}
