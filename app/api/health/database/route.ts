import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const result = await checkDatabaseConnection();

    if (result.success) {
      return NextResponse.json({
        status: 'healthy',
        database: result.databaseType,
        timestamp: new Date().toISOString(),
        message: 'Database connection is working properly'
      });
    } else {
      return NextResponse.json({
        status: 'unhealthy',
        error: result.error,
        timestamp: new Date().toISOString(),
        message: 'Database connection failed'
      }, { status: 503 });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed'
    }, { status: 500 });
  }
}
