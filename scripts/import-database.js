const { PrismaClient } = require('@prisma/client');

// This script imports data to your new database
// You'll need to run this with your new DATABASE_URL

async function importDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Importing database data...');
    
    // Read export file
    const fs = require('fs');
    if (!fs.existsSync('database-export.json')) {
      console.error('❌ database-export.json not found! Please export data first.');
      return;
    }
    
    const exportData = JSON.parse(fs.readFileSync('database-export.json', 'utf8'));
    
    console.log(`📊 Importing ${exportData.users.length} users...`);
    console.log(`🔑 Importing ${exportData.codes.length} codes...`);
    console.log(`📝 Importing ${exportData.exams.length} exams...`);
    
    // Import users
    for (const user of exportData.users) {
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: user,
          create: user
        });
      } catch (error) {
        console.log(`⚠️  Skipping user ${user.email}: ${error.message}`);
      }
    }
    
    // Import codes
    for (const code of exportData.codes) {
      try {
        await prisma.uniqueCode.upsert({
          where: { code: code.code },
          update: code,
          create: code
        });
      } catch (error) {
        console.log(`⚠️  Skipping code ${code.code}: ${error.message}`);
      }
    }
    
    // Import exams
    for (const exam of exportData.exams) {
      try {
        await prisma.exam.upsert({
          where: { id: exam.id },
          update: exam,
          create: exam
        });
      } catch (error) {
        console.log(`⚠️  Skipping exam ${exam.title}: ${error.message}`);
      }
    }
    
    console.log('✅ Database import completed successfully!');
    
  } catch (error) {
    console.error('❌ Error importing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importDatabase(); 