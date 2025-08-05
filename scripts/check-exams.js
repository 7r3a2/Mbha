const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function checkExams() {
  try {
    console.log('🔍 Checking exam data...\n');

    // Check database exams
    console.log('📊 Database Exams:');
    const dbExams = await prisma.exam.findMany();
    console.log(`Found ${dbExams.length} exams in database:`);
    dbExams.forEach((exam, index) => {
      console.log(`${index + 1}. ID: ${exam.id}`);
      console.log(`   Title: "${exam.title}"`);
      console.log(`   Subject: ${exam.subject}`);
      console.log(`   Questions: ${JSON.parse(exam.questions).length}`);
      console.log(`   Created: ${exam.createdAt}`);
      console.log('');
    });

    // Check JSON file exams
    console.log('📄 JSON File Exams:');
    const jsonPath = path.join(process.cwd(), 'data', 'exams.json');
    let jsonExams = [];
    if (fs.existsSync(jsonPath)) {
      const jsonData = fs.readFileSync(jsonPath, 'utf8');
      jsonExams = JSON.parse(jsonData);
      console.log(`Found ${jsonExams.length} exams in JSON file:`);
      jsonExams.forEach((exam, index) => {
        console.log(`${index + 1}. ID: ${exam.id}`);
        console.log(`   Title: "${exam.title}"`);
        console.log(`   Subject: ${exam.subject}`);
        console.log(`   Questions: ${exam.questions.length}`);
        console.log(`   Created: ${exam.createdAt}`);
        console.log('');
      });
    } else {
      console.log('No exams.json file found');
    }

    // Check for unnamed exams
    console.log('⚠️  Checking for unnamed exams:');
    const unnamedDbExams = dbExams.filter(exam => !exam.title || exam.title.trim() === '');
    const unnamedJsonExams = jsonExams.filter(exam => !exam.title || exam.title.trim() === '' || exam.title === 'undefined');
    
    if (unnamedDbExams.length > 0) {
      console.log(`Found ${unnamedDbExams.length} unnamed exams in database:`);
      unnamedDbExams.forEach(exam => {
        console.log(`   ID: ${exam.id}, Created: ${exam.createdAt}`);
      });
    }
    
    if (unnamedJsonExams.length > 0) {
      console.log(`Found ${unnamedJsonExams.length} unnamed exams in JSON file:`);
      unnamedJsonExams.forEach(exam => {
        console.log(`   ID: ${exam.id}, Created: ${exam.createdAt}`);
      });
    }

    if (unnamedDbExams.length === 0 && unnamedJsonExams.length === 0) {
      console.log('✅ No unnamed exams found');
    }

  } catch (error) {
    console.error('Error checking exams:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkExams(); 