import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    console.log('🔄 Resetting database and creating fresh admin...');
    
    // Delete all existing users
    const deleteResult = await prisma.user.deleteMany({});
    console.log(`🗑️ Deleted ${deleteResult.count} existing users`);
    
    // Create new admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@mbha.com',
        password: hashedPassword,
        uniqueCode: 'ADMIN2024',
        gender: 'Male',
        university: 'MBHA Medical School',
        hasWizaryExamAccess: true,
        hasApproachAccess: true,
        hasQbankAccess: true,
        hasCoursesAccess: true,
        isLocked: false
      }
    });
    
    console.log('✅ Created new admin user:', adminUser.email);
    
    // Check final user count
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: 'Database reset successfully',
      deletedUsers: deleteResult.count,
      newAdminCreated: true,
      adminEmail: 'admin@mbha.com',
      adminPassword: 'admin123',
      totalUsers: userCount
    });
    
  } catch (error) {
    console.error('❌ Database reset error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
