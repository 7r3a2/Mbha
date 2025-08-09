const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function migrateUsers() {
  console.log('🚀 MIGRATING USERS TO POSTGRESQL\n');
  
  // PostgreSQL connection
  const postgresPrisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
  
  // SQLite connection
  const sqlitePrisma = new PrismaClient({
    datasources: {
      db: {
        url: "file:./prisma/dev.db"
      }
    }
  });
  
  try {
    console.log('📊 Step 1: Checking current data...');
    
    // Check PostgreSQL users
    const postgresUserCount = await postgresPrisma.user.count();
    console.log(`   PostgreSQL users: ${postgresUserCount}`);
    
    // Check SQLite users
    let sqliteUsers = [];
    try {
      sqliteUsers = await sqlitePrisma.user.findMany();
      console.log(`   SQLite users: ${sqliteUsers.length}`);
    } catch (e) {
      console.log('   SQLite: No database found');
    }
    
    // Check export file
    let exportData = null;
    try {
      const exportContent = fs.readFileSync('database-export.json', 'utf8');
      exportData = JSON.parse(exportContent);
      console.log(`   Export file users: ${exportData.users ? exportData.users.length : 0}`);
    } catch (e) {
      console.log('   Export file: Not found or invalid');
    }
    
    // Determine migration source
    let usersToMigrate = [];
    let uniqueCodesToMigrate = [];
    let examsToMigrate = [];
    
    if (sqliteUsers.length > 0) {
      console.log('\n📋 Using SQLite as migration source...');
      usersToMigrate = sqliteUsers;
      
      try {
        uniqueCodesToMigrate = await sqlitePrisma.uniqueCode.findMany();
        examsToMigrate = await sqlitePrisma.exam.findMany();
      } catch (e) {
        console.log('   Note: Some tables not found in SQLite');
      }
    } else if (exportData && exportData.users) {
      console.log('\n📋 Using export file as migration source...');
      usersToMigrate = exportData.users;
      uniqueCodesToMigrate = exportData.uniqueCodes || [];
      examsToMigrate = exportData.exams || [];
    } else {
      console.log('\n❌ No users found to migrate!');
      return;
    }
    
    console.log(`\n🔄 Step 2: Migrating ${usersToMigrate.length} users...`);
    
    // Migrate users (skip duplicates)
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const user of usersToMigrate) {
      try {
        // Check if user already exists
        const existingUser = await postgresPrisma.user.findUnique({
          where: { email: user.email }
        });
        
        if (existingUser) {
          console.log(`   ⏭️  Skipping ${user.email} (already exists)`);
          skippedCount++;
          continue;
        }
        
        // Create user
        await postgresPrisma.user.create({
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            gender: user.gender,
            university: user.university,
            uniqueCode: user.uniqueCode,
            hasWizaryExamAccess: user.hasWizaryExamAccess ?? true,
            hasApproachAccess: user.hasApproachAccess ?? false,
            hasQbankAccess: user.hasQbankAccess ?? false,
            hasCoursesAccess: user.hasCoursesAccess ?? false,
            createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
            updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date()
          }
        });
        
        console.log(`   ✅ Migrated ${user.email}`);
        migratedCount++;
        
      } catch (error) {
        console.log(`   ❌ Failed to migrate ${user.email}: ${error.message}`);
      }
    }
    
    console.log(`\n📊 Migration Results:`);
    console.log(`   ✅ Migrated: ${migratedCount} users`);
    console.log(`   ⏭️  Skipped: ${skippedCount} users`);
    
    // Migrate unique codes
    if (uniqueCodesToMigrate.length > 0) {
      console.log(`\n🎫 Step 3: Migrating ${uniqueCodesToMigrate.length} unique codes...`);
      let codesMigrated = 0;
      
      for (const code of uniqueCodesToMigrate) {
        try {
          const existingCode = await postgresPrisma.uniqueCode.findUnique({
            where: { code: code.code }
          });
          
          if (!existingCode) {
            await postgresPrisma.uniqueCode.create({
              data: {
                code: code.code,
                used: code.used ?? false,
                usedBy: code.usedBy,
                usedAt: code.usedAt ? new Date(code.usedAt) : null,
                createdAt: code.createdAt ? new Date(code.createdAt) : new Date(),
                updatedAt: code.updatedAt ? new Date(code.updatedAt) : new Date()
              }
            });
            codesMigrated++;
          }
        } catch (error) {
          console.log(`   ❌ Failed to migrate code ${code.code}: ${error.message}`);
        }
      }
      console.log(`   ✅ Migrated ${codesMigrated} unique codes`);
    }
    
    // Migrate exams
    if (examsToMigrate.length > 0) {
      console.log(`\n📝 Step 4: Migrating ${examsToMigrate.length} exams...`);
      let examsMigrated = 0;
      
      for (const exam of examsToMigrate) {
        try {
          await postgresPrisma.exam.create({
            data: {
              title: exam.title,
              subject: exam.subject,
              examTime: exam.examTime,
              order: exam.order ?? 1,
              secretCode: exam.secretCode ?? "HaiderAlaa",
              questions: typeof exam.questions === 'string' ? exam.questions : JSON.stringify(exam.questions),
              createdAt: exam.createdAt ? new Date(exam.createdAt) : new Date(),
              updatedAt: exam.updatedAt ? new Date(exam.updatedAt) : new Date()
            }
          });
          examsMigrated++;
        } catch (error) {
          console.log(`   ❌ Failed to migrate exam ${exam.title}: ${error.message}`);
        }
      }
      console.log(`   ✅ Migrated ${examsMigrated} exams`);
    }
    
    // Final verification
    console.log(`\n✅ MIGRATION COMPLETE!`);
    const finalUserCount = await postgresPrisma.user.count();
    console.log(`   🎉 Total users in PostgreSQL: ${finalUserCount}`);
    
    console.log(`\n🔄 Next steps:`);
    console.log(`   1. Set up subscription system`);
    console.log(`   2. Set up Qbank data structure`);
    console.log(`   3. Test the admin panel`);
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await postgresPrisma.$disconnect();
    await sqlitePrisma.$disconnect();
  }
}

migrateUsers().catch(console.error);
