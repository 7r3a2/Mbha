const { PrismaClient } = require('@prisma/client');

async function checkProductionSchema() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking current database schema and data...\n');
    
    // Check users table structure and count
    console.log('👥 USERS TABLE:');
    const userCount = await prisma.user.count();
    console.log(`  📊 Total users: ${userCount}`);
    
    // Get sample user to see current structure
    const sampleUser = await prisma.user.findFirst();
    if (sampleUser) {
      console.log('  📋 User structure:');
      Object.keys(sampleUser).forEach(key => {
        console.log(`    - ${key}: ${typeof sampleUser[key]}`);
      });
    }
    
    // Check if users have access permissions
    const usersWithAccess = await prisma.user.findMany({
      where: {
        OR: [
          { hasApproachAccess: true },
          { hasQbankAccess: true },
          { hasCoursesAccess: true }
        ]
      }
    });
    console.log(`  🔑 Users with special access: ${usersWithAccess.length}`);
    
    // Check unique codes
    console.log('\n🎫 UNIQUE CODES TABLE:');
    const codeCount = await prisma.uniqueCode.count();
    console.log(`  📊 Total codes: ${codeCount}`);
    
    const usedCodes = await prisma.uniqueCode.count({
      where: { used: true }
    });
    console.log(`  ✅ Used codes: ${usedCodes}`);
    
    // Check exams
    console.log('\n📝 EXAMS TABLE:');
    const examCount = await prisma.exam.count();
    console.log(`  📊 Total exams: ${examCount}`);
    
    if (examCount > 0) {
      const sampleExam = await prisma.exam.findFirst();
      console.log('  📋 Exam structure:');
      Object.keys(sampleExam).forEach(key => {
        console.log(`    - ${key}: ${typeof sampleExam[key]}`);
      });
    }
    
    // Check database version/capabilities
    console.log('\n🛠️  DATABASE INFO:');
    console.log('  ✅ PostgreSQL connection successful');
    console.log('  ✅ Prisma client working');
    
    console.log('\n🎯 MIGRATION NEEDED:');
    console.log('  📁 Need to add: data/subscriptions.json functionality');
    console.log('  📁 Need to add: data/qbank-structure.json');
    console.log('  📁 Need to add: data/qbank-questions.json');
    console.log('  🔄 Current JSON files are not connected to PostgreSQL');
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    
    if (error.message.includes('Unknown argument')) {
      console.log('\n💡 This might be a schema mismatch. Let me check basic connection...');
      try {
        await prisma.$queryRaw`SELECT 1 as test`;
        console.log('✅ Basic database connection works');
      } catch (basicError) {
        console.error('❌ Basic connection failed:', basicError.message);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkProductionSchema().catch(console.error);
