import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Check all environment variables
    const databaseUrl = process.env.DATABASE_URL;
    const postgresUrl = process.env.POSTGRES_URL;
    const prismaDatabaseUrl = process.env.PRISMA_DATABASE_URL;
    
    console.log('📊 Environment variables:');
    console.log('DATABASE_URL:', databaseUrl ? 'Set' : 'Not set');
    console.log('POSTGRES_URL:', postgresUrl ? 'Set' : 'Not set');
    console.log('PRISMA_DATABASE_URL:', prismaDatabaseUrl ? 'Set' : 'Not set');
    
    // Test database connection
    const userCount = await prisma.user.count();
    
    // Get database info
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Determine which database we're connected to
    let databaseType = 'Unknown';
    if (prismaDatabaseUrl?.includes('accelerate.prisma-data.net')) {
      databaseType = 'Prisma Accelerate (Production)';
    } else if (databaseUrl?.includes('db.prisma.io')) {
      databaseType = 'Direct PostgreSQL (Production)';
    } else if (postgresUrl?.includes('db.prisma.io')) {
      databaseType = 'Direct PostgreSQL (Production)';
    } else {
      databaseType = 'Local/Other Database';
    }

    return NextResponse.json({
      success: true,
      databaseType,
      userCount,
      users,
      environmentVariables: {
        hasDatabaseUrl: !!databaseUrl,
        hasPostgresUrl: !!postgresUrl,
        hasPrismaDatabaseUrl: !!prismaDatabaseUrl,
        databaseUrlPreview: databaseUrl ? databaseUrl.substring(0, 50) + '...' : 'Not set',
        postgresUrlPreview: postgresUrl ? postgresUrl.substring(0, 50) + '...' : 'Not set',
        prismaUrlPreview: prismaDatabaseUrl ? prismaDatabaseUrl.substring(0, 50) + '...' : 'Not set'
      }
    });
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseType: 'Connection Failed'
    }, { status: 500 });
  }
}
