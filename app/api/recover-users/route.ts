import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { action, users } = await request.json();
    
    if (action === 'create_sample_users') {
      // Create sample users to test if database is working
      const sampleUsers = [
        {
          firstName: 'Test',
          lastName: 'User1',
          email: 'test1@mbha.com',
          password: 'password123',
          uniqueCode: 'TEST001',
          hasQbankAccess: true,
          hasWizaryExamAccess: true,
          hasApproachAccess: true,
          hasCoursesAccess: true
        },
        {
          firstName: 'Test',
          lastName: 'User2', 
          email: 'test2@mbha.com',
          password: 'password123',
          uniqueCode: 'TEST002',
          hasQbankAccess: true,
          hasWizaryExamAccess: true,
          hasApproachAccess: false,
          hasCoursesAccess: false
        }
      ];

      const createdUsers = [];
      
      for (const userData of sampleUsers) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        const user = await prisma.user.create({
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: hashedPassword,
            uniqueCode: userData.uniqueCode,
            hasQbankAccess: userData.hasQbankAccess,
            hasWizaryExamAccess: userData.hasWizaryExamAccess,
            hasApproachAccess: userData.hasApproachAccess,
            hasCoursesAccess: userData.hasCoursesAccess,
            gender: 'Male',
            university: 'Test University'
          }
        });
        
        createdUsers.push({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Sample users created successfully',
        users: createdUsers
      });
    }

    if (action === 'check_database') {
      const userCount = await prisma.user.count();
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          hasQbankAccess: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({
        success: true,
        userCount,
        users: allUsers,
        databaseStatus: 'Connected'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('❌ Error in recover users:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
