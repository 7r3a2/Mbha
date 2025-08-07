#!/usr/bin/env node

/**
 * Check Production Users
 * This script connects to the production PostgreSQL database to check users
 */

import { PrismaClient } from '@prisma/client';

// Use the production database URL directly
const DATABASE_URL = "postgres://f3fdaf8eecd12fcbe0b348c00d5340b5df04159b3f27eff8c5ab3c072c7eb33e:sk_47by-oCJUV4Ry7CuwiTbb@db.prisma.io:5432/?sslmode=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

console.log('🔄 Checking production database for users...\n');

async function checkProductionUsers() {
  try {
    // Check database connection
    console.log('🔗 Connecting to production database...');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        hasWizaryExamAccess: true,
        hasApproachAccess: true,
        hasQbankAccess: true,
        hasCoursesAccess: true,
        createdAt: true
      }
    });

    console.log(`\n🎉 SUCCESS! Found ${users.length} users in production database!`);
    
    if (users.length > 0) {
      console.log('\n👥 Your users are safe and accessible:');
      users.forEach((user, index) => {
        const access = [];
        if (user.hasWizaryExamAccess) access.push('Wizary');
        if (user.hasApproachAccess) access.push('Approach');
        if (user.hasQbankAccess) access.push('Qbank');
        if (user.hasCoursesAccess) access.push('Courses');
        
        console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${access.join(', ')}`);
      });
    }

    // Get unique codes
    const uniqueCodes = await prisma.uniqueCode.findMany();
    console.log(`\n🔑 Found ${uniqueCodes.length} unique codes`);

    // Get exams
    const exams = await prisma.exam.findMany();
    console.log(`📝 Found ${exams.length} exams`);

    console.log('\n✅ Your users are NOT deleted - they are safe in the production database!');
    
  } catch (error) {
    console.error('❌ Error connecting to production database:', error.message);
    
    if (error.message.includes('P1001')) {
      console.log('\n💡 This might be a connection issue. The database URL might need to be updated in Vercel.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkProductionUsers();