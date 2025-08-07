#!/usr/bin/env node

/**
 * User Migration Script
 * This script helps migrate users from local database to production
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

console.log('🔄 User Migration Script\n');

async function migrateUsers() {
  try {
    console.log('📊 Checking current users in production database...');
    
    // Check if there are any users in production
    const productionUserCount = await prisma.user.count();
    console.log(`Found ${productionUserCount} users in production database`);
    
    if (productionUserCount > 0) {
      console.log('✅ Users already exist in production database');
      console.log('Your users are safe and accessible!');
      return;
    }
    
    console.log('\n⚠️  No users found in production database');
    console.log('This means we need to set up the database connection');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Set up your production database (Vercel Postgres or Supabase)');
    console.log('2. Update your DATABASE_URL in Vercel environment variables');
    console.log('3. Run the database migration');
    console.log('4. Import your existing users');
    
    console.log('\n🛡️  Your local users are safe! They\'re still in your local database.');
    console.log('Once you set up the production database, we can migrate them safely.');
    
  } catch (error) {
    console.log('❌ Error connecting to production database');
    console.log('This is normal if the database isn\'t set up yet');
    console.log('\nError details:', error.message);
    
    console.log('\n📋 To fix this:');
    console.log('1. Set up Vercel Postgres in your Vercel dashboard');
    console.log('2. Or create a Supabase database');
    console.log('3. Update DATABASE_URL in Vercel environment variables');
    console.log('4. Run this script again');
  } finally {
    await prisma.$disconnect();
  }
}

// Export function for manual database setup
async function setupDatabase() {
  try {
    console.log('🔧 Setting up database schema...');
    
    // Push the schema to the database
    const { execSync } = await import('child_process');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('✅ Database schema set up successfully');
    
    // Set up access permissions
    console.log('🔐 Setting up access permissions...');
    execSync('node scripts/setup-access-permissions.js', { stdio: 'inherit' });
    
    console.log('✅ Access permissions configured');
    
  } catch (error) {
    console.log('❌ Error setting up database:', error.message);
  }
}

// Export function for importing users from local backup
async function importUsersFromBackup(backupPath) {
  try {
    console.log('📥 Importing users from backup...');
    
    if (!fs.existsSync(backupPath)) {
      console.log('❌ Backup file not found:', backupPath);
      return;
    }
    
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    
    if (backupData.users && backupData.users.length > 0) {
      console.log(`Found ${backupData.users.length} users in backup`);
      
      for (const user of backupData.users) {
        // Create user with proper access permissions
        await prisma.user.create({
          data: {
            ...user,
            hasWizaryExamAccess: true, // All users get wizary exam access
            hasApproachAccess: user.hasApproachAccess || false,
            hasQbankAccess: user.hasQbankAccess || false,
            hasCoursesAccess: user.hasCoursesAccess || false,
          }
        });
      }
      
      console.log('✅ Users imported successfully');
    } else {
      console.log('⚠️  No users found in backup file');
    }
    
  } catch (error) {
    console.log('❌ Error importing users:', error.message);
  }
}

// Run the migration
migrateUsers();

// Export functions for manual use
export { setupDatabase, importUsersFromBackup }; 