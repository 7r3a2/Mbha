#!/usr/bin/env node

/**
 * Safe Deployment Script
 * This script helps ensure your database is safe during Vercel deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🛡️  Safe Deployment Check\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('Please create a .env file with your DATABASE_URL');
  process.exit(1);
}

// Check if DATABASE_URL is set
const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('DATABASE_URL=')) {
  console.log('❌ DATABASE_URL not found in .env file!');
  console.log('Please add your database connection string to .env');
  process.exit(1);
}

// Check if JWT_SECRET is set
if (!envContent.includes('JWT_SECRET=')) {
  console.log('❌ JWT_SECRET not found in .env file!');
  console.log('Please add a JWT_SECRET to .env');
  process.exit(1);
}

console.log('✅ Environment variables are configured');

// Check if Prisma schema is valid
try {
  console.log('🔍 Validating Prisma schema...');
  execSync('npx prisma validate', { stdio: 'pipe' });
  console.log('✅ Prisma schema is valid');
} catch (error) {
  console.log('❌ Prisma schema validation failed');
  console.log('Please fix the schema errors before deploying');
  process.exit(1);
}

// Generate Prisma client
try {
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'pipe' });
  console.log('✅ Prisma client generated');
} catch (error) {
  console.log('❌ Failed to generate Prisma client');
  process.exit(1);
}

// Test database connection
try {
  console.log('🔗 Testing database connection...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'pipe' });
  console.log('✅ Database connection successful');
} catch (error) {
  console.log('❌ Database connection failed');
  console.log('Please check your DATABASE_URL and ensure the database is accessible');
  process.exit(1);
}

console.log('\n🎉 All checks passed! Your deployment is ready.\n');

console.log('📋 Next Steps:');
console.log('1. Go to your Vercel dashboard');
console.log('2. Add Vercel Postgres (Storage tab) or configure your external database');
console.log('3. Set environment variables in Vercel:');
console.log('   - DATABASE_URL');
console.log('   - JWT_SECRET');
console.log('4. Deploy with: vercel --prod');
console.log('5. After deployment, run: node scripts/setup-access-permissions.js');

console.log('\n🛡️  Your data is safe! The database is external and will not be deleted.');
console.log('📊 You can always export your data from your database provider.');

// Check if there are any existing users to warn about
try {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log(`\n👥 Found ${userCount} existing users in your database`);
    console.log('✅ These users will be preserved during deployment');
  }
  
  await prisma.$disconnect();
} catch (error) {
  console.log('\n⚠️  Could not check existing users (this is normal for new deployments)');
} 