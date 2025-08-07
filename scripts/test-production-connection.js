#!/usr/bin/env node

/**
 * Test Production Connection
 * This script tests if the production app can access the database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('🔄 Testing production database connection...\n');

async function testConnection() {
  try {
    console.log('🔗 Connecting to production database...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`\n👥 Found ${userCount} users in production database!`);
    
    if (userCount > 0) {
      console.log('\n🎉 SUCCESS! Your users are accessible!');
      
      // Get first few users as sample
      const sampleUsers = await prisma.user.findMany({
        take: 5,
        select: {
          firstName: true,
          lastName: true,
          email: true,
          hasWizaryExamAccess: true,
          hasApproachAccess: true,
          hasQbankAccess: true,
          hasCoursesAccess: true
        }
      });
      
      console.log('\n📋 Sample users:');
      sampleUsers.forEach((user, index) => {
        const access = [];
        if (user.hasWizaryExamAccess) access.push('Wizary');
        if (user.hasApproachAccess) access.push('Approach');
        if (user.hasQbankAccess) access.push('Qbank');
        if (user.hasCoursesAccess) access.push('Courses');
        
        console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${access.join(', ')}`);
      });
      
      if (userCount > 5) {
        console.log(`... and ${userCount - 5} more users`);
      }
    }
    
    // Count other data
    const uniqueCodeCount = await prisma.uniqueCode.count();
    const examCount = await prisma.exam.count();
    
    console.log(`\n📊 Database Summary:`);
    console.log(`- Users: ${userCount}`);
    console.log(`- Unique Codes: ${uniqueCodeCount}`);
    console.log(`- Exams: ${examCount}`);
    
    console.log('\n✅ Your production app is now connected to your database!');
    console.log('🌐 Your users can now log in at: https://mbha-website-v1-kko4pgoop-haideralaas-projects.vercel.app');
    
  } catch (error) {
    console.error('❌ Error connecting to production database:', error.message);
    
    if (error.message.includes('P1001')) {
      console.log('\n💡 The DATABASE_URL might not be set correctly in Vercel.');
      console.log('Please check your Vercel environment variables.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 