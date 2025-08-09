const { PrismaClient } = require('@prisma/client');

async function quickTest() {
  const prisma = new PrismaClient({
    log: ['error'],
  });
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`👥 Found ${userCount} users in database`);
    
    // Get first user as sample
    const firstUser = await prisma.user.findFirst();
    console.log(`📄 Sample user: ${firstUser?.firstName} ${firstUser?.lastName} (${firstUser?.email})`);
    
    // Check access fields
    const usersWithAccess = await prisma.user.findMany({
      where: {
        OR: [
          { hasApproachAccess: true },
          { hasQbankAccess: true },
          { hasCoursesAccess: true }
        ]
      }
    });
    console.log(`🔑 Users with special access: ${usersWithAccess.length}`);
    
    console.log('\n✅ Database is working! Your users are safe.');
    console.log('🔄 Now we need to add subscription features...');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

quickTest();
