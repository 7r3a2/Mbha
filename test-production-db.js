// Test production database connection
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

async function testProductionDatabase() {
  console.log('🔍 Testing PRODUCTION database connection...');
  
  // Check environment variables
  console.log('📊 Environment variables:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'Set' : 'Not set');
  console.log('PRISMA_DATABASE_URL:', process.env.PRISMA_DATABASE_URL ? 'Set' : 'Not set');
  
  if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL.substring(0, 30) + '...');
  }
  
  try {
    // Create Prisma client with production connection
    const prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
      errorFormat: 'pretty',
    });
    
    console.log('✅ Prisma client created successfully');
    
    // Test connection with simple query
    console.log('🔍 Testing with SELECT 1...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Raw query successful:', result);
    
    // Test user count - THIS IS YOUR PRODUCTION DATA
    console.log('🔍 Testing user count in PRODUCTION database...');
    const userCount = await prisma.user.count();
    console.log('✅ PRODUCTION user count:', userCount);
    
    // Test finding users
    console.log('🔍 Testing user lookup in PRODUCTION...');
    const users = await prisma.user.findMany({
      take: 5,
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
    console.log('✅ Found users in PRODUCTION:', users.length);
    if (users.length > 0) {
      console.log('📋 Recent users:');
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${user.createdAt}`);
      });
    }
    
    // Test database info
    console.log('🔍 Testing database info...');
    const dbInfo = await prisma.$queryRaw`SELECT version() as version`;
    console.log('✅ Database version:', dbInfo);
    
    console.log('🎉 PRODUCTION database connection successful!');
    console.log(`📊 Your production database has ${userCount} users`);
    
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
    
  } catch (error) {
    console.error('❌ PRODUCTION database connection failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    if (error.code === 'P1001') {
      console.error('🔍 This is a connection error - check your DATABASE_URL');
    } else if (error.code === 'P2002') {
      console.error('🔍 This is a unique constraint error');
    } else if (error.code === 'P2021') {
      console.error('🔍 This is a table not found error');
    } else if (error.code === 'P2022') {
      console.error('🔍 This is a column not found error');
    }
  }
}

// Run the test
testProductionDatabase().catch(console.error);
