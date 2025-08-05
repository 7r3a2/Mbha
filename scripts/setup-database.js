const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to generate random codes
function generateRandomCode(prefix = 'USER', length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Connected to database successfully!');

    // Create some initial admin codes
    console.log('🔑 Creating admin registration codes...');
    
    const adminCodes = [
      'ADMIN2024',
      'ADMIN001',
      'ADMIN002'
    ];

    for (const code of adminCodes) {
      try {
        await prisma.uniqueCode.create({
          data: {
            code: code,
            used: false,
            usedBy: null,
            usedAt: null
          }
        });
        console.log(`✅ Created admin code: ${code}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️  Code ${code} already exists`);
        } else {
          console.error(`❌ Error creating code ${code}:`, error);
        }
      }
    }

    // Create random user codes
    console.log('🔑 Creating random user codes...');
    
    const userCodes = [];
    for (let i = 0; i < 10; i++) {
      userCodes.push(generateRandomCode('USER', 6));
    }

    for (const code of userCodes) {
      try {
        await prisma.uniqueCode.create({
          data: {
            code: code,
            used: false,
            usedBy: null,
            usedAt: null
          }
        });
        console.log(`✅ Created user code: ${code}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️  Code ${code} already exists`);
        } else {
          console.error(`❌ Error creating code ${code}:`, error);
        }
      }
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('📋 Available codes:');
    console.log('👑 Admin codes: ADMIN2024, ADMIN001, ADMIN002');
    console.log('👤 Random user codes generated!');
    console.log('');
    console.log('🌐 Your website is now ready for users!');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('');
    console.log('💡 Make sure:');
    console.log('1. Your DATABASE_URL environment variable is set correctly');
    console.log('2. Your database is accessible');
    console.log('3. Prisma schema is up to date');
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase(); 