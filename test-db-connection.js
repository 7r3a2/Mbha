// Test database connection script
const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  // Check environment variables
  console.log('📊 Environment variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  console.log('POSTGRES_URL:', process.env.POSTGRES_URL ? 'Set' : 'Not set');
  console.log('PRISMA_DATABASE_URL:', process.env.PRISMA_DATABASE_URL ? 'Set' : 'Not set');
  
  if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL.substring(0, 20) + '...');
  }
  
  try {
    // Create Prisma client
    const prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
      errorFormat: 'pretty',
    });
    
    console.log('✅ Prisma client created successfully');
    
    // Test connection with simple query
    console.log('🔍 Testing with SELECT 1...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Raw query successful:', result);
    
    // Test user count
    console.log('🔍 Testing user count...');
    const userCount = await prisma.user.count();
    console.log('✅ User count:', userCount);
    
    // Test finding a user
    console.log('🔍 Testing user lookup...');
    const users = await prisma.user.findMany({
      take: 3,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    });
    console.log('✅ Found users:', users.length);
    if (users.length > 0) {
      console.log('📋 Sample user:', users[0]);
    }
    
    // Test database info
    console.log('🔍 Testing database info...');
    const dbInfo = await prisma.$queryRaw`SELECT version() as version`;
    console.log('✅ Database version:', dbInfo);
    
    console.log('🎉 All database tests passed!');
    
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
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
testDatabaseConnection().catch(console.error);
