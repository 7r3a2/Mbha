const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log('🔌 Testing database connection...');
    console.log('📋 DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test user count
    const userCount = await prisma.user.count();
    console.log('📊 Users in database:', userCount);
    
    // Test unique codes count
    const codeCount = await prisma.uniqueCode.count();
    console.log('🔑 Unique codes in database:', codeCount);
    
    // Test exams count
    const examCount = await prisma.exam.count();
    console.log('📝 Exams in database:', examCount);
    
    console.log('🎉 All database operations working!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔍 Full error:', error);
    
    if (error.message.includes('P1001')) {
      console.log('💡 This looks like a connection issue. Check your DATABASE_URL.');
    } else if (error.message.includes('P1012')) {
      console.log('💡 This looks like a URL format issue. Check your DATABASE_URL format.');
    } else if (error.message.includes('P1017')) {
      console.log('💡 This looks like a server connection issue. Check if your database is running.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection(); 