const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupAccessPermissions() {
  try {
    console.log('🔄 Setting up access permissions...');
    
    // Update all existing users to have default access permissions
    const result = await prisma.user.updateMany({
      data: {
        hasWizaryExamAccess: true,    // All users get wizary exam access by default
        hasApproachAccess: false,     // Admin controlled
        hasQbankAccess: false,        // Admin controlled
        hasCoursesAccess: false,      // Admin controlled
      }
    });
    
    console.log(`✅ Updated ${result.count} users with default access permissions`);
    
    // Get all users to show their current permissions
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        hasWizaryExamAccess: true,
        hasApproachAccess: true,
        hasQbankAccess: true,
        hasCoursesAccess: true,
      }
    });
    
    console.log('\n📊 Current user access permissions:');
    users.forEach(user => {
      const permissions = [];
      if (user.hasWizaryExamAccess) permissions.push('Wizary Exam');
      if (user.hasApproachAccess) permissions.push('Approach');
      if (user.hasQbankAccess) permissions.push('Qbank');
      if (user.hasCoursesAccess) permissions.push('Courses');
      
      console.log(`  ${user.firstName} ${user.lastName} (${user.email}): ${permissions.length > 0 ? permissions.join(', ') : 'No access'}`);
    });
    
  } catch (error) {
    console.error('❌ Error setting up access permissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupAccessPermissions(); 