import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword } from '@/lib/db-utils';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('🔐 Login attempt for email:', email);
    console.log('🌐 Environment:', process.env.NODE_ENV);
    console.log('📋 DATABASE_URL set:', !!process.env.DATABASE_URL);
    console.log('🔗 DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20) + '...');

    try {
      // Find user by email
      console.log('🔍 Searching for user with email:', email);
      const user = await findUserByEmail(email);
      
      if (!user) {
        console.log('❌ User not found in database for email:', email);
        console.log('🔍 This means the user was not created in the Vercel database');
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      console.log('✅ User found:', {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        uniqueCode: user.uniqueCode,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });

      // Verify password
      console.log('🔐 Verifying password...');
      console.log('📋 Input password length:', password.length);
      console.log('🔑 Stored password hash length:', user.password.length);
      console.log('🔑 Stored password hash starts with:', user.password.substring(0, 10) + '...');
      
      const isValidPassword = await verifyPassword(password, user.password);
      
      console.log('🔍 Password verification result:', isValidPassword);
      
      if (!isValidPassword) {
        console.log('❌ Invalid password for user:', email);
        console.log('🔍 Password verification failed');
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      console.log('✅ Password verified successfully');

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      // Return user data (without password) and token
      const { password: _, ...userWithoutPassword } = user;

      console.log('🎉 Login successful for:', email);

      return NextResponse.json({
        token,
        user: userWithoutPassword,
      });
    } catch (dbError: any) {
      console.error('❌ Database error during login:', dbError);
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
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}