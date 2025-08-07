const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugUserLogin() {
  try {
    console.log('🔍 Debugging user login process...');
    
    // Test with admin@mbha.com
    const email = 'admin@mbha.com';
    
    // Simulate the login process
    console.log(`\n🔐 Simulating login for: ${email}`);
    
    // Find user by email (like the login route does)
    const user = await prisma.user.findUnique({
      where: { email: email }
    });
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    
    console.log('\n📊 User data from database:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Unique Code: ${user.uniqueCode}`);
    console.log(`   Approach Access: ${user.hasApproachAccess}`);
    console.log(`   Qbank Access: ${user.hasQbankAccess}`);
    console.log(`   Courses Access: ${user.hasCoursesAccess}`);
    console.log(`   Wizary Access: ${user.hasWizaryExamAccess}`);
    
    // Check if this is an admin user
    const isAdmin = user.uniqueCode && user.uniqueCode.startsWith('ADMIN');
    console.log(`\n👑 Is Admin: ${isAdmin ? '✅ Yes' : '❌ No'}`);
    
    // Simulate what the dashboard would show
    console.log('\n🎯 Dashboard would show:');
    console.log(`   Approach button: ${user.hasApproachAccess ? '✅ SHOWN' : '❌ HIDDEN'}`);
    console.log(`   Qbank button: ${user.hasQbankAccess ? '✅ SHOWN' : '❌ HIDDEN'}`);
    console.log(`   Courses button: ${user.hasCoursesAccess ? '✅ SHOWN' : '❌ HIDDEN'}`);
    console.log(`   Wizary button: ${user.hasWizaryExamAccess ? '✅ SHOWN' : '❌ HIDDEN'}`);
    
    // Test with a regular user
    console.log('\n🔍 Testing with a regular user...');
    const regularUsers = await prisma.user.findMany({
      where: {
        NOT: {
          uniqueCode: {
            startsWith: 'ADMIN'
          }
        }
      },
      take: 1
    });
    
    if (regularUsers.length > 0) {
      const regularUser = regularUsers[0];
      console.log(`\n👤 Regular user: ${regularUser.firstName} ${regularUser.lastName} (${regularUser.email})`);
      console.log(`   Unique Code: ${regularUser.uniqueCode}`);
      console.log(`   Approach Access: ${regularUser.hasApproachAccess}`);
      console.log(`   Qbank Access: ${regularUser.hasQbankAccess}`);
      console.log(`   Courses Access: ${regularUser.hasCoursesAccess}`);
      console.log(`   Wizary Access: ${regularUser.hasWizaryExamAccess}`);
      
      console.log('\n🎯 Dashboard would show for regular user:');
      console.log(`   Approach button: ${regularUser.hasApproachAccess ? '✅ SHOWN' : '❌ HIDDEN'}`);
      console.log(`   Qbank button: ${regularUser.hasQbankAccess ? '✅ SHOWN' : '❌ HIDDEN'}`);
      console.log(`   Courses button: ${regularUser.hasCoursesAccess ? '✅ SHOWN' : '❌ HIDDEN'}`);
      console.log(`   Wizary button: ${regularUser.hasWizaryExamAccess ? '✅ SHOWN' : '❌ HIDDEN'}`);
    }
    
  } catch (error) {
    console.error('❌ Error debugging login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugUserLogin(); 