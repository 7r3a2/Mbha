import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  return await setupUserResponses();
}

export async function POST(request: NextRequest) {
  return await setupUserResponses();
}

async function setupUserResponses() {
  try {
    console.log('🔧 Setting up UserResponse table...');
    
    // Test the connection
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Try to create a test user response to see if the table exists
    try {
      const testResponse = await prisma.userResponse.create({
        data: {
          userId: 'test-user',
          questionId: 'test-question',
          userAnswer: 0,
          isCorrect: true,
          isFlagged: false
        }
      });
      
      // Delete the test response
      await prisma.userResponse.delete({
        where: { id: testResponse.id }
      });
      
      console.log('✅ UserResponse table exists and is working');
      return NextResponse.json({ 
        success: true, 
        message: 'UserResponse table is ready' 
      });
      
    } catch (error: any) {
      console.log('❌ UserResponse table error:', error.message);
      
      // If the table doesn't exist, we need to create it
      if (error.message.includes('table') || error.message.includes('does not exist')) {
        console.log('🔧 Creating UserResponse table...');
        
                 // Execute raw SQL to create the table for PostgreSQL
         await prisma.$executeRaw`
           CREATE TABLE IF NOT EXISTS user_responses (
             id TEXT PRIMARY KEY,
             "userId" TEXT NOT NULL,
             "questionId" TEXT NOT NULL,
             "userAnswer" INTEGER NOT NULL,
             "isCorrect" BOOLEAN NOT NULL,
             "isFlagged" BOOLEAN NOT NULL DEFAULT false,
             "answeredAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
             UNIQUE("userId", "questionId")
           )
         `;
        
        console.log('✅ UserResponse table created successfully');
        return NextResponse.json({ 
          success: true, 
          message: 'UserResponse table created successfully' 
        });
      }
      
      throw error;
    }
    
  } catch (error) {
    console.error('❌ Setup error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to setup UserResponse table' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
