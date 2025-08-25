import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Setting up sessions table...');
    
    // Create user_sessions table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "user_sessions" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "sessionId" TEXT NOT NULL,
        "deviceInfo" TEXT,
        "ipAddress" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
      )
    `;

    // Create unique index on sessionId
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "user_sessions_sessionId_key" ON "user_sessions"("sessionId")
    `;

    // Add foreign key constraint
    await prisma.$executeRaw`
      ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `;

    console.log('✅ Sessions table setup completed');
    
    return NextResponse.json({
      success: true,
      message: 'Sessions table setup completed successfully'
    });
  } catch (error) {
    console.error('❌ Error setting up sessions table:', error);
    return NextResponse.json(
      { error: 'Failed to setup sessions table' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Setting up sessions table...');
    
    // Create user_sessions table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "user_sessions" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "sessionId" TEXT NOT NULL,
        "deviceInfo" TEXT,
        "ipAddress" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "expiresAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
      )
    `;

    // Create unique index on sessionId
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "user_sessions_sessionId_key" ON "user_sessions"("sessionId")
    `;

    // Add foreign key constraint
    await prisma.$executeRaw`
      ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `;

    // Add isLocked and lastLoginAt columns to users table if they don't exist
    await prisma.$executeRaw`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isLocked" BOOLEAN NOT NULL DEFAULT false
    `;

    await prisma.$executeRaw`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3)
    `;

    console.log('✅ Sessions table and user columns setup completed');
    
    return NextResponse.json({
      success: true,
      message: 'Sessions table and user columns setup completed successfully'
    });
  } catch (error) {
    console.error('❌ Error setting up sessions table:', error);
    return NextResponse.json(
      { error: 'Failed to setup sessions table' },
      { status: 500 }
    );
  }
}
