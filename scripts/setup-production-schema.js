#!/usr/bin/env node

/**
 * Setup Production Schema
 * This script creates the database tables in production PostgreSQL
 */

import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: "postgres://f3fdaf8eecd12fcbe0b348c00d5340b5df04159b3f27eff8c5ab3c072c7eb33e:sk_47by-oCJUV4Ry7CuwiTbb@db.prisma.io:5432/?sslmode=require"
});

console.log('🔧 Setting up production database schema...\n');

async function setupSchema() {
  try {
    await client.connect();
    console.log('✅ Connected to production database');

    // Create Users table
    console.log('📝 Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        gender TEXT,
        university TEXT,
        "uniqueCode" TEXT NOT NULL,
        "hasWizaryExamAccess" BOOLEAN NOT NULL DEFAULT true,
        "hasApproachAccess" BOOLEAN NOT NULL DEFAULT false,
        "hasQbankAccess" BOOLEAN NOT NULL DEFAULT false,
        "hasCoursesAccess" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Unique Codes table
    console.log('📝 Creating unique_codes table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS unique_codes (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        used BOOLEAN NOT NULL DEFAULT false,
        "usedBy" TEXT,
        "usedAt" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Exams table
    console.log('📝 Creating exams table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS exams (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        "examTime" INTEGER NOT NULL,
        "order" INTEGER NOT NULL DEFAULT 1,
        "secretCode" TEXT NOT NULL DEFAULT 'HaiderAlaa',
        questions TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('\n✅ Database schema created successfully!');
    
    // Check existing data
    const userCount = await client.query('SELECT COUNT(*) as count FROM users');
    const examCount = await client.query('SELECT COUNT(*) as count FROM exams');
    const codeCount = await client.query('SELECT COUNT(*) as count FROM unique_codes');
    
    console.log('\n📊 Current data:');
    console.log(`- Users: ${userCount.rows[0].count}`);
    console.log(`- Exams: ${examCount.rows[0].count}`);
    console.log(`- Codes: ${codeCount.rows[0].count}`);
    
    console.log('\n🎉 Production database is ready!');
    console.log('Your admin dashboard should now work!');

  } catch (error) {
    console.error('❌ Error setting up schema:', error.message);
  } finally {
    await client.end();
  }
}

setupSchema();