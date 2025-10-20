import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check all possible environment variables
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      POSTGRES_URL: process.env.POSTGRES_URL ? 'Set' : 'Not set',
      PRISMA_DATABASE_URL: process.env.PRISMA_DATABASE_URL ? 'Set' : 'Not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
    };
    
    // Check if we're in production
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercel = process.env.VERCEL === '1';
    
    // Get database URL info (without exposing the full URL)
    let databaseInfo = 'Not set';
    if (process.env.DATABASE_URL) {
      const url = process.env.DATABASE_URL;
      if (url.includes('postgres://')) {
        databaseInfo = `PostgreSQL (${url.split('@')[1]?.split('/')[0] || 'unknown host'})`;
      } else if (url.includes('file:')) {
        databaseInfo = 'SQLite (local file)';
      } else {
        databaseInfo = 'Other database type';
      }
    }
    
    return NextResponse.json({
      success: true,
      environment: {
        isProduction,
        isVercel,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        region: process.env.VERCEL_REGION,
      },
      database: {
        type: databaseInfo,
        urlSet: !!process.env.DATABASE_URL,
        postgresUrlSet: !!process.env.POSTGRES_URL,
        prismaUrlSet: !!process.env.PRISMA_DATABASE_URL,
      },
      auth: {
        jwtSecretSet: !!process.env.JWT_SECRET,
      },
      timestamp: new Date().toISOString(),
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
