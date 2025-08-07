#!/usr/bin/env node

/**
 * Add Access Permission Columns
 * This script adds the missing access permission columns to existing users
 */

import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: "postgres://f3fdaf8eecd12fcbe0b348c00d5340b5df04159b3f27eff8c5ab3c072c7eb33e:sk_47by-oCJUV4Ry7CuwiTbb@db.prisma.io:5432/?sslmode=require"
});

console.log('🔧 Adding access permission columns...\n');

async function addAccessColumns() {
  try {
    await client.connect();
    console.log('✅ Connected to production database');

    // Check if columns exist first
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('hasWizaryExamAccess', 'hasApproachAccess', 'hasQbankAccess', 'hasCoursesAccess')
    `);

    const existingColumns = columnCheck.rows.map(row => row.column_name);
    console.log('Existing access columns:', existingColumns);

    // Add missing columns
    const columnsToAdd = [
      { name: 'hasWizaryExamAccess', default: 'true' },
      { name: 'hasApproachAccess', default: 'false' },
      { name: 'hasQbankAccess', default: 'false' },
      { name: 'hasCoursesAccess', default: 'false' }
    ];

    for (const col of columnsToAdd) {
      if (!existingColumns.includes(col.name)) {
        console.log(`📝 Adding column: ${col.name}`);
        await client.query(`
          ALTER TABLE users 
          ADD COLUMN "${col.name}" BOOLEAN NOT NULL DEFAULT ${col.default}
        `);
      } else {
        console.log(`✅ Column ${col.name} already exists`);
      }
    }

    // Update existing users to have Wizary exam access
    await client.query(`
      UPDATE users 
      SET "hasWizaryExamAccess" = true 
      WHERE "hasWizaryExamAccess" IS NULL OR "hasWizaryExamAccess" = false
    `);

    console.log('\n✅ Access permission columns added successfully!');
    
    // Verify the update
    const userCount = await client.query('SELECT COUNT(*) as count FROM users WHERE "hasWizaryExamAccess" = true');
    console.log(`📊 Users with Wizary exam access: ${userCount.rows[0].count}`);
    
    console.log('\n🎉 Database is now fully configured!');
    console.log('Your admin dashboard should work perfectly now!');

  } catch (error) {
    console.error('❌ Error adding columns:', error.message);
  } finally {
    await client.end();
  }
}

addAccessColumns();