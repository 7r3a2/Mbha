const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdminUser() {
  try {
    console.log('🔍 Checking admin@mbha.com user...');
    
    // Find the specific user
    const user = await prisma.user.findUnique({
      where: { email: 'admin@mbha.com' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        hasApproachAccess: true,
        hasQbankAccess: true,
        hasCoursesAccess: true,
        hasWizaryExamAccess: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    if (!user) {
      console.log('❌ User admin@mbha.com not found!');
      return;
    }
    
    console.log('\n📊 Current permissions for admin@mbha.com:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.firstName} ${user.lastName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Approach: ${user.hasApproachAccess ? '✅' : '❌'}`);
    console.log(`   Qbank: ${user.hasQbankAccess ? '✅' : '❌'}`);
    console.log(`   Courses: ${user.hasCoursesAccess ? '✅' : '❌'}`);
    console.log(`   Wizary: ${user.hasWizaryExamAccess ? '✅' : '❌'}`);
    console.log(`   Created: ${user.createdAt}`);
    console.log(`   Updated: ${user.updatedAt}`);
    
    // Test updating permissions
    console.log('\n🧪 Testing permission update...');
    const updatedUser = await prisma.user.update({
      where: { email: 'admin@mbha.com' },
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
    console.log(`   Updated at: ${updatedUser.updatedAt}`);
    
    // Verify the update was saved
    console.log('\n🔍 Verifying the update was saved...');
    const verifyUser = await prisma.user.findUnique({
      where: { email: 'admin@mbha.com' },
      select: {
        hasApproachAccess: true,
        hasQbankAccess: true,
        hasCoursesAccess: true,
        updatedAt: true,
      }
    });
    
    console.log('📊 Verification results:');
    console.log(`   Approach: ${verifyUser.hasApproachAccess ? '✅' : '❌'}`);
    console.log(`   Qbank: ${verifyUser.hasQbankAccess ? '✅' : '❌'}`);
    console.log(`   Courses: ${verifyUser.hasCoursesAccess ? '✅' : '❌'}`);
    console.log(`   Updated at: ${verifyUser.updatedAt}`);
    
  } catch (error) {
    console.error('❌ Error checking admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser(); 