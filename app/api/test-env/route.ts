import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 Testing environment variables...');
    
    const envVars = {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL
    };
    
    console.log('📊 Environment variables:', envVars);
    
    return NextResponse.json({
      success: true,
      message: 'Environment variables test',
      envVars: envVars
    });
  } catch (error) {
    console.error('❌ Environment test failed:', error);
    return NextResponse.json(
      { 
        error: 'Environment test failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
