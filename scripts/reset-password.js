const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    console.log('🔐 Password Reset Tool');
    console.log('=====================');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      },
      orderBy: { createdAt: 'asc' }
    });
    
    console.log('👥 Available users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
    });
    
    // For demo purposes, let's reset the first admin user's password
    const targetUser = users.find(u => u.email === 'admin@mbha.net') || users[0];
    
    if (!targetUser) {
      console.log('❌ No users found in database');
      return;
    }
    
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: { id: targetUser.id },
      data: { password: hashedPassword }
    });
    
    console.log(`✅ Password reset for ${targetUser.firstName} ${targetUser.lastName}`);
    console.log(`📧 Email: ${targetUser.email}`);
    console.log(`🔑 New password: ${newPassword}`);
    console.log('');
    console.log('🔗 You can now login with these credentials!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
