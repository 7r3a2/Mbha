import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db-utils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { checkUserSessions, createUserSession, lockUserAccount, deactivateAllUserSessions, isSameDevice } from '@/lib/session-utils';
import { testConnection } from '@/lib/simple-db';

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
    
    // Simple database connection test
    const dbTest = await testConnection();
    if (!dbTest.success) {
      console.error('❌ Database connection failed:', dbTest.error);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later or contact support.' },
        { status: 503 }
      );
    }

    // Find user
    const user = await findUserByEmail(email);
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

    // Check if user is admin (bypass single-device restriction for admins)
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
    
    if (isAdmin) {
      console.log('👑 Admin login detected, bypassing single-device restriction');
      // For admin accounts, just create a new session without checking existing ones
      const sessionId = await createUserSession(user.id, request);
      console.log('✅ Admin session created:', sessionId);
      
      // Generate JWT token with session ID
      const token = jwt.sign(
        { userId: user.id, sessionId },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      console.log('✅ Admin login successful for:', email);

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
    }

    // For regular users, apply single-device restriction
    console.log('🔍 Checking sessions for regular user:', email);
    const { activeSessions, shouldLock } = await checkUserSessions(user.id);
    console.log(`📱 Active sessions for ${email}: ${activeSessions}, shouldLock: ${shouldLock}`);

    // Check if user already has an active session
    if (activeSessions > 0) {
      // Check if it's the same device
      const sameDevice = await isSameDevice(user.id, request);
      console.log(`🔍 Same device check for ${email}: ${sameDevice}`);
      
      if (sameDevice) {
        // Same device - allow login by deactivating old session and creating new one
        console.log('🔄 Same device detected, refreshing session for:', email);
        await deactivateAllUserSessions(user.id);
      } else {
        // Different device - lock account
        console.log('🔒 Different device detected, locking account for:', email);
        await lockUserAccount(user.id);
        await deactivateAllUserSessions(user.id);
        
        return NextResponse.json(
          { 
            error: 'Account Locked',
            message: 'You are already logged in on another device. Your account has been locked for security. Please contact the developer to unlock your account.'
          },
          { status: 423 } // 423 Locked
        );
      }
    }

    // Create new session
    console.log('🆕 Creating new session for:', email);
    const sessionId = await createUserSession(user.id, request);
    console.log('✅ New session created:', sessionId);

    // Generate JWT token with session ID
    const token = jwt.sign(
      { userId: user.id, sessionId },
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