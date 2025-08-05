const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@mbha.com' }
    });

    if (existingUser) {
      console.log('✅ Test user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create test user
    const user = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@mbha.com',
        password: hashedPassword,
        gender: 'Male',
        university: 'Test University',
        uniqueCode: 'TEST001'
      }
    });

    console.log('✅ Test user created successfully:', user.email);
    console.log('📧 Email: admin@mbha.com');
    console.log('🔑 Password: admin123');
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 