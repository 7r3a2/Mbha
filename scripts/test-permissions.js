const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPermissions() {
  try {
    console.log('🔍 Testing user permissions...');
    
    // Get all users with their permissions
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        hasApproachAccess: true,
        hasQbankAccess: true,
        hasCoursesAccess: true,
        hasWizaryExamAccess: true,
      }
    });
    
    console.log('\n📊 Current user permissions:');
    users.forEach(user => {
      console.log(`\n👤 ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`   Approach: ${user.hasApproachAccess ? '✅' : '❌'}`);
      console.log(`   Qbank: ${user.hasQbankAccess ? '✅' : '❌'}`);
      console.log(`   Courses: ${user.hasCoursesAccess ? '✅' : '❌'}`);
      console.log(`   Wizary: ${user.hasWizaryExamAccess ? '✅' : '❌'}`);
    });
    
    // Test updating a user's permissions
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\n🧪 Testing permission update for: ${testUser.firstName} ${testUser.lastName}`);
      
      const updatedUser = await prisma.user.update({
        where: { id: testUser.id },
        data: {
          hasApproachAccess: true,
          hasQbankAccess: true,
          hasCoursesAccess: true,
        }
      });
      
      console.log('✅ Permissions updated successfully!');
      console.log(`   Approach: ${updatedUser.hasApproachAccess ? '✅' : '❌'}`);
      console.log(`   Qbank: ${updatedUser.hasQbankAccess ? '✅' : '❌'}`);
      console.log(`   Courses: ${updatedUser.hasCoursesAccess ? '✅' : '❌'}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing permissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPermissions(); 