import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db-utils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { checkUserSessions, createUserSession, lockUserAccount, deactivateAllUserSessions } from '@/lib/session-utils';

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
    
    if (isAdmin) {
      console.log('👑 Admin login detected, bypassing single-device restriction');
      // For admin accounts, just create a new session without checking existing ones
      const sessionId = await createUserSession(user.id, request);
      
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
    const { activeSessions, shouldLock } = await checkUserSessions(user.id);
    console.log(`📱 Active sessions for ${email}: ${activeSessions}`);

    // Only lock if there are multiple active sessions (more than 1)
    if (activeSessions > 1) {
      console.log('🔒 Multiple devices detected, locking account for:', email);
      await lockUserAccount(user.id);
      await deactivateAllUserSessions(user.id);
      
      return NextResponse.json(
        { 
          error: 'Account Locked',
          message: 'Multiple devices detected. Your account has been locked for security. Please contact the developer to unlock your account.'
        },
        { status: 423 } // 423 Locked
      );
    }

    // Deactivate any existing sessions (single device policy)
    if (activeSessions > 0) {
      console.log('🔄 Deactivating existing sessions for:', email);
      await deactivateAllUserSessions(user.id);
    }

    // Create new session
    console.log('🆕 Creating new session for:', email);
    const sessionId = await createUserSession(user.id, request);

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
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}