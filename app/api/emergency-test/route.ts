import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    console.log('🚨 EMERGENCY TEST - Checking everything...');
    
    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'NOT SET',
      PRISMA_DATABASE_URL: process.env.PRISMA_DATABASE_URL ? 'SET' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    };
    
    console.log('📊 Environment check:', envCheck);
    
    // Try to connect to database
    let dbResult = 'Not tested';
    let userCount = 0;
    let errorDetails = null;
    
    try {
      console.log('🔍 Creating Prisma client...');
      const prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
        errorFormat: 'pretty',
      });
      
      console.log('✅ Prisma client created');
      
      console.log('🔍 Testing database connection...');
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('✅ Raw query result:', result);
      
      console.log('🔍 Getting user count...');
      const count = await prisma.user.count();
      userCount = count;
      console.log('✅ User count:', count);
      
      console.log('🔍 Getting sample users...');
      const users = await prisma.user.findMany({
        take: 3,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      });
      console.log('✅ Sample users:', users);
      
      await prisma.$disconnect();
      dbResult = 'SUCCESS';
      
    } catch (dbError: any) {
      console.error('❌ Database error:', dbError);
      dbResult = 'FAILED';
      errorDetails = {
        message: dbError.message,
        code: dbError.code,
        stack: dbError.stack?.substring(0, 500)
      };
    }
    
    return NextResponse.json({
      status: 'EMERGENCY TEST COMPLETE',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        result: dbResult,
        userCount,
        error: errorDetails
      },
      message: dbResult === 'SUCCESS' ? 'Database is working!' : 'Database connection failed'
    });
    
  } catch (error: any) {
    console.error('❌ Emergency test failed:', error);
    return NextResponse.json({
      status: 'EMERGENCY TEST FAILED',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
