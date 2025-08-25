import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Check if database is connected
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
        createdAt: true
      }
    });

    // Test password hashing
    const testPassword = 'test123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const isValid = await bcrypt.compare(testPassword, hashedPassword);

    return NextResponse.json({
      success: true,
      databaseConnected: true,
      userCount,
      users,
      passwordTest: {
        hashed: hashedPassword.substring(0, 20) + '...',
        isValid
      }
    });
  } catch (error) {
    console.error('❌ Test auth error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseConnected: false
    }, { status: 500 });
  }
}
