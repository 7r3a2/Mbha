const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetTestPassword() {
  try {
    console.log('🔐 Password Reset for Testing');
    console.log('=============================');
    
    // Reset password for admin@mbha.net (the admin user)
    const targetEmail = 'admin@mbha.net';
    const newPassword = 'admin123';
    
    const user = await prisma.user.findUnique({
      where: { email: targetEmail }
    });
    
    if (!user) {
      console.log(`❌ User with email ${targetEmail} not found`);
      return;
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: { email: targetEmail },
      data: { password: hashedPassword }
    });
    
    console.log(`✅ Password reset successful!`);
    console.log(`📧 Email: ${targetEmail}`);
    console.log(`🔑 New password: ${newPassword}`);
    console.log(`👤 User: ${user.firstName} ${user.lastName}`);
    console.log('');
    console.log('🔗 You can now login with these credentials!');
    console.log('🌐 Try logging in at: http://localhost:3000/login');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetTestPassword();
