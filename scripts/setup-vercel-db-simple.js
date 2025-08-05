const { PrismaClient } = require('@prisma/client');

// Create Prisma client with explicit PostgreSQL configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function setupVercelDatabase() {
  try {
    console.log('🚀 Setting up Vercel database...');
    console.log('📋 DATABASE_URL set:', !!process.env.DATABASE_URL);
    console.log('🔗 DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    
    // Test connection first
    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Create admin codes
    console.log('👑 Creating admin codes...');
    const adminCodes = ['ADMIN2024', 'ADMIN001', 'ADMIN002'];
    
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
          console.log(`⚠️  Admin code ${code} already exists`);
        } else {
          console.error(`❌ Error creating admin code ${code}:`, error.message);
        }
      }
    }
    
    // Create user codes
    console.log('👤 Creating user codes...');
    const userCodes = ['USER001', 'USER002', 'USER003', 'USER004', 'USER005'];
    
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
          console.log(`⚠️  User code ${code} already exists`);
        } else {
          console.error(`❌ Error creating user code ${code}:`, error.message);
        }
      }
    }
    
    // Verify everything works
    console.log('🔍 Verifying database setup...');
    const userCount = await prisma.user.count();
    const codeCount = await prisma.uniqueCode.count();
    const examCount = await prisma.exam.count();
    
    console.log('📊 Database summary:');
    console.log(`   👤 Users: ${userCount}`);
    console.log(`   🔑 Codes: ${codeCount}`);
    console.log(`   📝 Exams: ${examCount}`);
    
    console.log('🎉 Vercel database setup complete!');
    console.log('');
    console.log('📋 Available admin codes: ADMIN2024, ADMIN001, ADMIN002');
    console.log('📋 Available user codes: USER001, USER002, USER003, USER004, USER005');
    console.log('');
    console.log('🌐 Your website is now ready for users!');
    
  } catch (error) {
    console.error('❌ Error setting up Vercel database:', error);
    console.error('🔍 Full error details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupVercelDatabase(); 