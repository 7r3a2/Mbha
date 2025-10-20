import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Direct database connection - no complex imports
const prisma = new PrismaClient({
  log: ['error'],
  errorFormat: 'pretty',
});

// Password utility functions
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export async function POST(request: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      university,
      uniqueCode
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !uniqueCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('🔐 Registration attempt for email:', email);
    console.log('🌐 Environment:', process.env.NODE_ENV);
    console.log('📋 DATABASE_URL set:', !!process.env.DATABASE_URL);
    console.log('🔗 DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20) + '...');

    try {
      // Check if user already exists
      console.log('🔍 Checking if user already exists...');
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        console.log('❌ User already exists:', email);
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }

      // Validate unique code
      console.log('🔍 Validating unique code:', uniqueCode);
      const codeRecord = await prisma.uniqueCode.findUnique({
        where: { code: uniqueCode }
      });
      
      if (!codeRecord) {
        console.log('❌ Invalid registration code:', uniqueCode);
        return NextResponse.json(
          { error: 'Invalid registration code' },
          { status: 400 }
        );
      }

      if (codeRecord.used) {
        console.log('❌ Registration code already used:', uniqueCode);
        return NextResponse.json(
          { error: 'Registration code has already been used' },
          { status: 400 }
        );
      }

      // Create user
      console.log('👤 Creating user in database...');
      const hashedPassword = await hashPassword(password);
      
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          gender,
          university,
          uniqueCode,
        },
      });

      console.log('✅ User created successfully:', {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        uniqueCode: user.uniqueCode
      });

      // Mark code as used
      console.log('🔑 Marking code as used...');
      await prisma.uniqueCode.update({
        where: { code: uniqueCode },
        data: { used: true }
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      // Return user data (without password) and token
      const { password: _, ...userWithoutPassword } = user;

      console.log('🎉 Registration successful for:', email);

      return NextResponse.json({
        token,
        user: userWithoutPassword,
      }, { status: 201 });
    } catch (dbError: any) {
      console.error('❌ Database error during registration:', dbError);
      console.error('🔍 Error details:', {
        message: dbError.message,
        code: dbError.code,
        stack: dbError.stack
      });
      
      // Handle specific database errors
      if (dbError.code === 'P1001' || dbError.message?.includes('connection')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please try again later or contact support.' },
          { status: 503 }
        );
      }
      
      if (dbError.code === 'P2002' || dbError.message?.includes('unique constraint')) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later or contact support.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}