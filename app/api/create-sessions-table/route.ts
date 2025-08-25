import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Creating sessions table using Prisma schema...');
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection works');
    
    // Try to create the table using the exact schema definition
    try {
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
        );
      `;
      
      // Create unique index
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "user_sessions_sessionId_key" ON "user_sessions"("sessionId");
      `;
      
      // Add foreign key constraint
      await prisma.$executeRaw`
        ALTER TABLE "user_sessions" ADD CONSTRAINT IF NOT EXISTS "user_sessions_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      `;
      
      console.log('✅ Sessions table created successfully');
      
      return NextResponse.json({
        success: true,
        message: 'Sessions table created successfully with all constraints'
      });
    } catch (error) {
      console.log('❌ Error creating sessions table:', error);
      
      // Check if table already exists
      try {
        const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "user_sessions"`;
        console.log('✅ Sessions table already exists');
        return NextResponse.json({
          success: true,
          message: 'Sessions table already exists',
          sessionCount: result
        });
      } catch (checkError) {
        console.log('❌ Sessions table does not exist:', checkError);
        return NextResponse.json({
          success: false,
          message: 'Could not create sessions table',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return NextResponse.json(
      { 
        error: 'Database connection failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
