#!/usr/bin/env node

/**
 * Backup Users from SQLite
 * This script exports all users from the current SQLite database
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

console.log('🔄 Backing up users from SQLite database...\n');

async function backupUsers() {
  try {
    // Get all users
    const users = await prisma.user.findMany();
    const uniqueCodes = await prisma.uniqueCode.findMany();
    const exams = await prisma.exam.findMany();

    console.log(`📊 Found ${users.length} users`);
    console.log(`📊 Found ${uniqueCodes.length} unique codes`);
    console.log(`📊 Found ${exams.length} exams`);

    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      users: users,
      uniqueCodes: uniqueCodes,
      exams: exams
    };

    // Save backup to file
    const backupPath = `backup-${Date.now()}.json`;
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

    console.log(`\n✅ Backup saved to: ${backupPath}`);
    
    console.log('\n👥 Users in backup:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
    });

    return backupPath;
    
  } catch (error) {
    console.error('❌ Error backing up users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

backupUsers();