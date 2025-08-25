const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function showAllUsers() {
  try {
    console.log('👥 All Users in Database:');
    console.log('========================');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        uniqueCode: true,
        university: true,
        hasWizaryExamAccess: true,
        hasApproachAccess: true,
        hasQbankAccess: true,
        hasCoursesAccess: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });
    
    console.log(`📊 Total users found: ${users.length}`);
    console.log('');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🔑 Code: ${user.uniqueCode}`);
      console.log(`   🏫 University: ${user.university || 'Not specified'}`);
      console.log(`   📅 Created: ${new Date(user.createdAt).toLocaleDateString()}`);
      console.log(`   🔐 Access: Wizary(${user.hasWizaryExamAccess ? '✅' : '❌'}) Approach(${user.hasApproachAccess ? '✅' : '❌'}) QBank(${user.hasQbankAccess ? '✅' : '❌'}) Courses(${user.hasCoursesAccess ? '✅' : '❌'})`);
      console.log('');
    });
    
    // Check if this matches what you expect
    if (users.length !== 26) {
      console.log(`⚠️  Expected 26 users but found ${users.length}`);
      console.log('💡 This might mean:');
      console.log('   - We\'re connected to a different database');
      console.log('   - The users are in a different table/schema');
      console.log('   - We need to import your real user data');
    } else {
      console.log('✅ Found all 26 users as expected!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showAllUsers();
