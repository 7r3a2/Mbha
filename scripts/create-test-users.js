#!/usr/bin/env node

/**
 * Create Test Users Script
 * This script creates test users to verify the system works
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

console.log('🔄 Creating test users...\n');

async function createTestUsers() {
  try {
    // Create some test users
    const testUsers = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@mbha.net',
        password: await bcrypt.hash('admin123', 10),
        gender: 'Male',
        university: 'MBHA Medical School',
        uniqueCode: 'MBHA2024-001',
        hasWizaryExamAccess: true,
        hasApproachAccess: true,
        hasQbankAccess: true,
        hasCoursesAccess: true,
      },
      {
        firstName: 'John',
        lastName: 'Student',
        email: 'john@student.com',
        password: await bcrypt.hash('student123', 10),
        gender: 'Male',
        university: 'Medical University',
        uniqueCode: 'MBHA2024-002',
        hasWizaryExamAccess: true,
        hasApproachAccess: false,
        hasQbankAccess: false,
        hasCoursesAccess: false,
      },
      {
        firstName: 'Sarah',
        lastName: 'Medic',
        email: 'sarah@medic.com',
        password: await bcrypt.hash('medic123', 10),
        gender: 'Female',
        university: 'Health Sciences University',
        uniqueCode: 'MBHA2024-003',
        hasWizaryExamAccess: true,
        hasApproachAccess: true,
        hasQbankAccess: true,
        hasCoursesAccess: false,
      }
    ];

    console.log('Creating users...');
    
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });
      
      if (existingUser) {
        console.log(`✅ User ${userData.email} already exists`);
        continue;
      }
      
      const user = await prisma.user.create({
        data: userData
      });
      
      console.log(`✅ Created user: ${user.firstName} ${user.lastName} (${user.email})`);
    }

    // Update unique codes to mark some as used
    const usedCodes = ['MBHA2024-001', 'MBHA2024-002', 'MBHA2024-003'];
    for (const code of usedCodes) {
      await prisma.uniqueCode.upsert({
        where: { code },
        update: { 
          used: true, 
          usedBy: testUsers.find(u => u.uniqueCode === code)?.email,
          usedAt: new Date()
        },
        create: {
          code,
          used: true,
          usedBy: testUsers.find(u => u.uniqueCode === code)?.email,
          usedAt: new Date()
        }
      });
    }

    console.log('\n🎉 Test users created successfully!');
    console.log('\n📊 Summary:');
    console.log('- Admin User: admin@mbha.net (password: admin123) - Full Access');
    console.log('- Student: john@student.com (password: student123) - Wizary Exam Only');
    console.log('- Medic: sarah@medic.com (password: medic123) - Wizary + Approach + Qbank');
    
    // Count total users
    const totalUsers = await prisma.user.count();
    console.log(`\n👥 Total users in database: ${totalUsers}`);
    
  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();