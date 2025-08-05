const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function setupVercelDatabase() {
  try {
    console.log('🚀 Setting up Vercel database...');
    console.log('📋 DATABASE_URL set:', !!process.env.DATABASE_URL);
    
    // Step 1: Push the schema to create tables
    console.log('📊 Creating database tables...');
    try {
      execSync('npx prisma db push --force-reset', { 
        stdio: 'inherit',
        env: process.env 
      });
      console.log('✅ Database tables created successfully!');
    } catch (pushError) {
      console.error('❌ Error pushing schema:', pushError.message);
      throw pushError;
    }
    
    // Step 2: Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    try {
      execSync('npx prisma generate', { 
        stdio: 'inherit',
        env: process.env 
      });
      console.log('✅ Prisma client generated!');
    } catch (generateError) {
      console.error('❌ Error generating client:', generateError.message);
      throw generateError;
    }
    
    // Step 3: Test connection
    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Step 4: Create initial admin codes
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
    
    // Step 5: Create some user codes
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
    
    // Step 6: Verify everything works
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