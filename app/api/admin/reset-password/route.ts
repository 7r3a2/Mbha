import { NextRequest, NextResponse } from 'next/server';
import { updateUserPassword, findUserById } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { userId, newPassword } = await request.json();
    
    console.log('🔐 Password reset attempt for user ID:', userId);
    console.log('📋 New password length:', newPassword?.length);
    
    if (!userId || !newPassword) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'User ID and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      console.log('❌ Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // First, let's check if the user exists
    console.log('🔍 Checking if user exists...');
    const existingUser = await findUserById(userId);
    if (!existingUser) {
      console.log('❌ User not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ User found:', {
      id: existingUser.id,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName
    });

    // Update the password
    console.log('🔐 Updating password...');
    const updatedUser = await updateUserPassword(userId, newPassword);
    
    console.log('✅ Password updated successfully for user:', updatedUser.email);
    console.log('📅 Updated at:', updatedUser.updatedAt);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Password updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error: any) {
    console.error('❌ Error resetting password:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Failed to reset password', details: error.message },
      { status: 500 }
    );
  }
}