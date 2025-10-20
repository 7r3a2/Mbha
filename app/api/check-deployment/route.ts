import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if we're in Vercel production
    const isVercel = process.env.VERCEL === '1';
    const isProduction = process.env.NODE_ENV === 'production';
    const vercelEnv = process.env.VERCEL_ENV;
    const region = process.env.VERCEL_REGION;
    
    // Check environment variables
    const envStatus = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      PRISMA_DATABASE_URL: !!process.env.PRISMA_DATABASE_URL,
      JWT_SECRET: !!process.env.JWT_SECRET,
    };
    
    // Test database connection if possible
    let dbStatus = 'Not tested';
    let userCount = 0;
    
    try {
      const { prisma } = await import('@/lib/simple-db');
      const count = await prisma.user.count();
      userCount = count;
      dbStatus = 'Connected';
    } catch (dbError: any) {
      dbStatus = `Error: ${dbError.message}`;
    }
    
    return NextResponse.json({
      deployment: {
        isVercel,
        isProduction,
        vercelEnv,
        region,
        timestamp: new Date().toISOString(),
      },
      environment: envStatus,
      database: {
        status: dbStatus,
        userCount,
      },
      message: isVercel ? 'Deployed on Vercel' : 'Running locally'
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
