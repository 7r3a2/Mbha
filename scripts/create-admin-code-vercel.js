const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./dev.db'
    }
  }
});

async function createAdminCode() {
  try {
    // Check if we can connect to the database
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Generate a unique code
    const code = 'ADMIN' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Create the unique code in database
    const uniqueCode = await prisma.uniqueCode.create({
      data: {
        code: code,
        used: false,
        usedBy: null,
        usedAt: null
      }
    });

    console.log('✅ Admin registration code created successfully!');
    console.log('🔑 Code:', code);
    console.log('📝 Use this code to register your admin account');
    console.log('🌐 Go to: https://mbha-website-v1-hl0erl0n0-7r3aas-projects.vercel.app/signup');
    
    return code;
  } catch (error) {
    console.error('❌ Error creating admin code:', error);
    console.log('💡 Make sure your DATABASE_URL environment variable is set correctly');
  } finally {
    await prisma.$disconnect();
  }
}

createAdminCode(); 