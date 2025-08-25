import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Resetting all sessions and unlocking all accounts...');
    
    // 1. Unlock all accounts
    await prisma.user.updateMany({
      data: {
        isLocked: false
      }
    });
    console.log('✅ All accounts unlocked');
    
    // 2. Clear all sessions
    await prisma.userSession.deleteMany({});
    console.log('✅ All sessions cleared');
    
    // 3. Reset lastLoginAt for all users
    await prisma.user.updateMany({
      data: {
        lastLoginAt: null
      }
    });
    console.log('✅ All lastLoginAt reset');
    
    return NextResponse.json({
      success: true,
      message: 'All sessions cleared and accounts unlocked. You can now login!'
    });
  } catch (error) {
    console.error('❌ Error resetting sessions:', error);
    return NextResponse.json(
      { error: 'Failed to reset sessions' },
      { status: 500 }
    );
  }
}
