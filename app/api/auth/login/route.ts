import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Direct database connection - no complex imports
const prisma = new PrismaClient({
  log: ['error'],
  errorFormat: 'pretty',
});

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('🔍 Login attempt for:', email);
    console.log('🌐 Environment:', process.env.NODE_ENV);
    console.log('📋 DATABASE_URL set:', !!process.env.DATABASE_URL);
    console.log('🔗 DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20) + '...');

    // Find user directly
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('❌ User not found:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('✅ User found:', user.email);

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('✅ Password verified for:', email);

    // Check if user is admin (bypass restrictions for admins)
    const isAdmin = user.email === 'admin@mbha.com' || user.email === 'admin@mbha.net' || user.uniqueCode === 'ADMIN2024';
    console.log('👤 User type:', isAdmin ? 'ADMIN' : 'REGULAR USER');
    
    // Check if account is locked (non-admin users)
    if (!isAdmin && user.isLocked) {
      console.log('🔒 Account is locked for:', email);
      return NextResponse.json(
        { 
          error: 'Account Locked',
          message: 'Your account is locked. Please contact the developer to unlock your account.'
        },
        { status: 423 } // 423 Locked
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for:', email);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        hasWizaryExamAccess: user.hasWizaryExamAccess,
        hasApproachAccess: user.hasApproachAccess,
        hasQbankAccess: user.hasQbankAccess,
        hasCoursesAccess: user.hasCoursesAccess
      }
    });
  } catch (error: any) {
    console.error('❌ Login error:', error);
    
    // Handle specific database errors
    if (error.code === 'P1001' || error.message?.includes('connection')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later or contact support.' },
        { status: 503 }
      );
    }
    
    if (error.code === 'P2002' || error.message?.includes('unique constraint')) {
      return NextResponse.json(
        { error: 'Account conflict. Please contact support.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}