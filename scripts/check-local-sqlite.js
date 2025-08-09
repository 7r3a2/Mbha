const { PrismaClient } = require('@prisma/client');

async function checkSQLite() {
  // Connect to SQLite
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "file:./prisma/dev.db"
      }
    }
  });
  
  try {
    console.log('🔍 Checking local SQLite database...');
    
    const userCount = await prisma.user.count();
    console.log(`👥 SQLite users: ${userCount}`);
    
    if (userCount > 0) {
      console.log('\n📋 Sample users:');
      const users = await prisma.user.findMany({ take: 5 });
      users.forEach(user => {
        console.log(`  - ${user.firstName} ${user.lastName} (${user.email})`);
      });
      
      console.log('\n🎯 FOUND YOUR USERS IN SQLITE!');
      console.log('💡 We need to migrate them to PostgreSQL');
    } else {
      console.log('❌ No users found in SQLite either');
    }
    
  } catch (error) {
    console.error('❌ SQLite error:', error.message);
    console.log('💡 SQLite database might not exist yet');
  } finally {
    await prisma.$disconnect();
  }
}

checkSQLite();
