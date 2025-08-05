const fs = require('fs');
const path = require('path');

function cleanupExams() {
  try {
    console.log('🧹 Cleaning up unnamed exams...\n');

    const jsonPath = path.join(process.cwd(), 'data', 'exams.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.log('❌ No exams.json file found');
      return;
    }

    // Read current exams
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const exams = JSON.parse(jsonData);
    
    console.log(`📊 Found ${exams.length} total exams`);

    // Filter out unnamed exams
    const validExams = exams.filter(exam => 
      exam.title && 
      exam.title.trim() !== '' && 
      exam.title !== 'undefined'
    );

    const removedExams = exams.filter(exam => 
      !exam.title || 
      exam.title.trim() === '' || 
      exam.title === 'undefined'
    );

    console.log(`✅ Keeping ${validExams.length} valid exams`);
    console.log(`🗑️  Removing ${removedExams.length} unnamed exams:`);
    
    removedExams.forEach((exam, index) => {
      console.log(`   ${index + 1}. ID: ${exam.id}, Subject: ${exam.subject}, Created: ${exam.createdAt}`);
    });

    // Write back the cleaned data
    fs.writeFileSync(jsonPath, JSON.stringify(validExams, null, 2));
    
    console.log(`\n✅ Cleanup completed! Saved ${validExams.length} exams to exams.json`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

cleanupExams(); 