import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...');
    
    // Check environment variables
    const databaseUrl = process.env.DATABASE_URL;
    const postgresUrl = process.env.POSTGRES_URL;
    const prismaDatabaseUrl = process.env.PRISMA_DATABASE_URL;
    
    console.log('📊 Environment variables:');
    console.log('DATABASE_URL:', databaseUrl ? 'Set' : 'Not set');
    console.log('POSTGRES_URL:', postgresUrl ? 'Set' : 'Not set');
    console.log('PRISMA_DATABASE_URL:', prismaDatabaseUrl ? 'Set' : 'Not set');
    
    // Try to import and test the database connection
    try {
      const { prisma } = await import('@/lib/database');
      
      // Test with a simple query
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('✅ Database connection successful:', result);
      
      return NextResponse.json({
        success: true,
        message: 'Database connection is working',
        environment: {
          DATABASE_URL: !!databaseUrl,
          POSTGRES_URL: !!postgresUrl,
          PRISMA_DATABASE_URL: !!prismaDatabaseUrl
        },
        testResult: result
      });
    } catch (dbError: any) {
      console.error('❌ Database connection failed:', dbError);
      
      return NextResponse.json({
        success: false,
        error: dbError.message,
        code: dbError.code,
        environment: {
          DATABASE_URL: !!databaseUrl,
          POSTGRES_URL: !!postgresUrl,
          PRISMA_DATABASE_URL: !!prismaDatabaseUrl
        }
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('❌ Test connection error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Failed to test database connection'
    }, { status: 500 });
  }
}
