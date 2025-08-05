const { PrismaClient } = require('@prisma/client');

// This script exports data from your old database
// You'll need to run this with your old DATABASE_URL

async function exportDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Exporting database data...');
    
    // Export users
    const users = await prisma.user.findMany();
    console.log(`📊 Found ${users.length} users`);
    
    // Export unique codes
    const codes = await prisma.uniqueCode.findMany();
    console.log(`🔑 Found ${codes.length} codes`);
    
    // Export exams
    const exams = await prisma.exam.findMany();
    console.log(`📝 Found ${exams.length} exams`);
    
    // Create export object
    const exportData = {
      users: users.map(user => ({
        ...user,
        password: user.password // Keep encrypted passwords
      })),
      codes: codes,
      exams: exams,
      exportDate: new Date().toISOString()
    };
    
    // Save to file
    const fs = require('fs');
    fs.writeFileSync('database-export.json', JSON.stringify(exportData, null, 2));
    
    console.log('✅ Database exported to database-export.json');
    console.log('📁 You can now use this file to import data to your new database');
    
  } catch (error) {
    console.error('❌ Error exporting database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportDatabase(); 