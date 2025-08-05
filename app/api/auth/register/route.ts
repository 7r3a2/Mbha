import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail, findUniqueCode, markCodeAsUsed } from '@/lib/db-utils';
import jwt from 'jsonwebtoken';

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
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        console.log('❌ User already exists:', email);
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }

      // Validate unique code
      console.log('🔍 Validating unique code:', uniqueCode);
      const codeRecord = await findUniqueCode(uniqueCode);
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
      const user = await createUser({
        firstName,
        lastName,
        email,
        password,
        gender,
        university,
        uniqueCode,
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
      await markCodeAsUsed(uniqueCode, user.id);

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
      
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later or contact support.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}