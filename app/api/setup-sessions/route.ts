import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Testing database permissions and SQL...');
    
    // Test 1: Basic connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Test 1: Basic connection works');
    
    // Test 2: Check if we can create a simple table
    try {
      await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS test_table (id TEXT PRIMARY KEY)`;
      console.log('✅ Test 2: Can create simple table');
      
      // Clean up test table
      await prisma.$executeRaw`DROP TABLE IF EXISTS test_table`;
      console.log('✅ Test 2: Can drop table');
    } catch (error) {
      console.log('❌ Test 2: Cannot create table:', error);
      return NextResponse.json({
        success: false,
        message: 'Database does not have CREATE TABLE permissions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Test 3: Try to create the actual sessions table
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          sessionId TEXT UNIQUE NOT NULL,
          deviceInfo TEXT,
          ipAddress TEXT,
          isActive BOOLEAN DEFAULT true,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expiresAt TIMESTAMP NOT NULL
        )
      `;
      console.log('✅ Test 3: Sessions table created successfully');
      
      return NextResponse.json({
        success: true,
        message: 'Sessions table created successfully'
      });
    } catch (error) {
      console.log('❌ Test 3: Error creating sessions table:', error);
      
      // Test 4: Check if table already exists
      try {
        await prisma.$queryRaw`SELECT COUNT(*) FROM user_sessions LIMIT 1`;
        console.log('✅ Test 4: Sessions table already exists');
        return NextResponse.json({
          success: true,
          message: 'Sessions table already exists'
        });
      } catch (checkError) {
        console.log('❌ Test 4: Sessions table does not exist:', checkError);
        return NextResponse.json({
          success: false,
          message: 'Could not create sessions table',
          error: error instanceof Error ? error.message : 'Unknown error',
          details: 'Table creation failed and table does not exist'
        });
      }
    }
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return NextResponse.json(
      { 
        error: 'Database test failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 POST: Creating sessions table...');
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection verified');

    // Create the table with error details
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          sessionId TEXT UNIQUE NOT NULL,
          deviceInfo TEXT,
          ipAddress TEXT,
          isActive BOOLEAN DEFAULT true,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expiresAt TIMESTAMP NOT NULL
        )
      `;
      
      console.log('✅ Sessions table created successfully');
      
      return NextResponse.json({
        success: true,
        message: 'Sessions table created successfully'
      });
    } catch (error) {
      console.error('❌ Error creating sessions table:', error);
      
      // Try to get more details about the error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      return NextResponse.json(
        { 
          error: 'Failed to create sessions table', 
          details: errorMessage,
          stack: errorStack
        },
        { status: 500 }
      );
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
