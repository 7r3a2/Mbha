import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // This endpoint will help us understand what environment variables are available
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_REGION: process.env.VERCEL_REGION,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'NOT SET',
      PRISMA_DATABASE_URL: process.env.PRISMA_DATABASE_URL ? 'SET' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    };
    
    // Check if we have any database URL
    const hasAnyDbUrl = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL);
    
    return NextResponse.json({
      success: true,
      environment: envInfo,
      hasDatabaseUrl: hasAnyDbUrl,
      message: hasAnyDbUrl ? 'Database URL is available' : 'No database URL found',
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
