import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Health check: Testing database connection...');
    
    const result = await checkDatabaseConnection();
    
    if (result.success) {
      console.log('✅ Database health check passed');
      return NextResponse.json({
        status: 'healthy',
        database: result.databaseType,
        timestamp: new Date().toISOString(),
        message: 'Database connection is working properly'
      });
    } else {
      console.error('❌ Database health check failed:', result.error);
      return NextResponse.json({
        status: 'unhealthy',
        error: result.error,
        timestamp: new Date().toISOString(),
        message: 'Database connection failed'
      }, { status: 503 });
    }
  } catch (error: any) {
    console.error('❌ Health check error:', error);
    return NextResponse.json({
      status: 'error',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed'
    }, { status: 500 });
  }
}
