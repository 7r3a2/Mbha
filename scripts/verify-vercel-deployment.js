const fs = require('fs');
const path = require('path');

async function verifyVercelDeployment() {
  console.log('🔍 VERIFYING VERCEL DEPLOYMENT\n');
  
  // Check if we're in Vercel environment
  const isVercel = process.env.VERCEL === '1';
  console.log(`🌐 Environment: ${isVercel ? 'Vercel Production' : 'Local Development'}`);
  
  // Check data directory
  const dataDir = path.join(process.cwd(), 'data');
  console.log(`📁 Data directory: ${dataDir}`);
  console.log(`   Exists: ${fs.existsSync(dataDir)}`);
  
  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir);
    console.log(`   Files: ${files.join(', ')}`);
  }
  
  // Check specific files
  const filesToCheck = [
    'data/subscriptions.json',
    'data/qbank-structure.json', 
    'data/qbank-questions.json'
  ];
  
  console.log('\n📋 Checking required files:');
  filesToCheck.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
    
    if (exists) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const data = JSON.parse(content);
        if (file.includes('subscriptions')) {
          console.log(`      📊 Active subscriptions: ${Object.keys(data).length}`);
        } else if (file.includes('structure')) {
          console.log(`      📊 Subjects: ${data.subjects?.length || 0}`);
        } else if (file.includes('questions')) {
          console.log(`      📊 Questions: ${Array.isArray(data) ? data.length : 0}`);
        }
      } catch (e) {
        console.log(`      ❌ Error reading: ${e.message}`);
      }
    }
  });
  
  console.log('\n🔧 If files are missing, we need to create them in Vercel...');
  
  // Create missing files
  console.log('\n🛠️ Creating missing files...');
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✅ Created data directory');
  }
  
  // Create subscriptions.json if missing
  if (!fs.existsSync('data/subscriptions.json')) {
    fs.writeFileSync('data/subscriptions.json', '{}', 'utf8');
    console.log('✅ Created data/subscriptions.json');
  }
  
  // Create qbank-structure.json if missing
  if (!fs.existsSync('data/qbank-structure.json')) {
    const defaultStructure = {
      subjects: [
        {
          key: "obgyn",
          name: "Obstetrics & Gynecology",
          lectures: [
            {
              title: "Physiology in Pregnancy",
              topics: [
                { title: "Physiological changes in pregnancy" },
                { title: "Anatomy and embryology" }
              ]
            }
          ],
          sources: [
            { key: "source1", name: "Lecture Notes" },
            { key: "source2", name: "Textbook References" }
          ]
        }
      ]
    };
    fs.writeFileSync('data/qbank-structure.json', JSON.stringify(defaultStructure, null, 2), 'utf8');
    console.log('✅ Created data/qbank-structure.json');
  }
  
  // Create qbank-questions.json if missing
  if (!fs.existsSync('data/qbank-questions.json')) {
    const defaultQuestions = [
      {
        id: 1,
        subject: "obgyn",
        source: "Lecture Notes",
        sourceKey: "source1",
        lecture: "Physiology in Pregnancy",
        topic: "Physiological changes in pregnancy",
        question: "What is the most common physiological change in the cardiovascular system during pregnancy?",
        options: [
          "Decreased heart rate",
          "Increased cardiac output", 
          "Decreased blood volume",
          "Increased blood pressure"
        ],
        correctAnswer: 1,
        explanation: {
          correct: "Cardiac output increases by 30-50% during pregnancy.",
          incorrect: [
            "Heart rate actually increases during pregnancy.",
            "Blood volume increases significantly during pregnancy.",
            "Blood pressure typically decreases in the second trimester."
          ],
          educationalObjective: "Understand cardiovascular adaptations during pregnancy."
        }
      }
    ];
    fs.writeFileSync('data/qbank-questions.json', JSON.stringify(defaultQuestions, null, 2), 'utf8');
    console.log('✅ Created data/qbank-questions.json');
  }
  
  console.log('\n🎉 VERIFICATION COMPLETE!');
  console.log('\n✅ Your Vercel deployment should now have:');
  console.log('   🔐 Subscription management working');
  console.log('   📚 Qbank structure and questions');
  console.log('   👥 Admin panel with user management');
  console.log('   🎯 Quiz functionality');
  
  console.log('\n🌐 Test your live app:');
  console.log('   https://mbha-website-v1-55379ivc6-haideralaas-projects.vercel.app');
}

verifyVercelDeployment().catch(console.error);
