const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function showUsers() {
  try {
    console.log('👥 Available users for login:');
    console.log('================================');
    
    const users = await prisma.user.findMany({
      select: {
        email: true,
        firstName: true,
        lastName: true,
        uniqueCode: true,
        hasWizaryExamAccess: true,
        hasApproachAccess: true,
        hasQbankAccess: true,
        hasCoursesAccess: true
      },
      orderBy: { createdAt: 'asc' }
    });
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Code: ${user.uniqueCode}`);
      console.log(`   Access: Wizary(${user.hasWizaryExamAccess ? '✅' : '❌'}) Approach(${user.hasApproachAccess ? '✅' : '❌'}) QBank(${user.hasQbankAccess ? '✅' : '❌'}) Courses(${user.hasCoursesAccess ? '✅' : '❌'})`);
      console.log('');
    });
    
    console.log('🔑 Test passwords:');
    console.log('   - For admin users: try "admin123" or "password"');
    console.log('   - For regular users: try "password" or "123456"');
    console.log('   - If those don\'t work, you may need to reset passwords');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showUsers();
