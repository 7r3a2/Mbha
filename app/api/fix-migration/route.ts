import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🔧 Fixing stuck migration...');
    
    // Check current migration status
    const migrations = await prisma.$queryRaw`
      SELECT * FROM "_prisma_migrations" 
      ORDER BY "finished_at" DESC
    `;
    
    console.log('📋 Current migrations:', migrations);
    
    // Try to reset the stuck migration
    try {
      await prisma.$executeRaw`
        DELETE FROM "_prisma_migrations" 
        WHERE "id" = '889b2626-0b36-4d82-a3e3-c64f14814a87'
      `;
      console.log('✅ Deleted stuck migration');
    } catch (error) {
      console.log('⚠️ Could not delete migration:', error);
    }
    
    // Force a schema sync
    try {
      await prisma.$executeRaw`SELECT 1`;
      console.log('✅ Database connection working');
    } catch (error) {
      console.log('❌ Database connection failed:', error);
    }
    
    // Check users after fix
    const userCount = await prisma.user.count();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        hasQbankAccess: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Migration fix attempted',
      userCount,
      users,
      migrations: migrations
    });
    
  } catch (error) {
    console.error('❌ Migration fix error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
