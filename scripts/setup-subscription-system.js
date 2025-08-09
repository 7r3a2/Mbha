const fs = require('fs');
const path = require('path');

async function setupSubscriptionSystem() {
  console.log('🔧 SETTING UP SUBSCRIPTION SYSTEM\n');
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✅ Created data directory');
  }
  
  // Create subscriptions.json
  const subscriptionsFile = path.join(dataDir, 'subscriptions.json');
  if (!fs.existsSync(subscriptionsFile)) {
    fs.writeFileSync(subscriptionsFile, '{}', 'utf8');
    console.log('✅ Created data/subscriptions.json');
  } else {
    console.log('✅ data/subscriptions.json already exists');
  }
  
  // Create qbank-structure.json
  const qbankStructureFile = path.join(dataDir, 'qbank-structure.json');
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
          },
          {
            title: "Medical Disorders in Pregnancy",
            topics: [
              { title: "D.M. in pregnancy" },
              { title: "Hypertensive disorder in pregnancy" }
            ]
          }
        ],
        sources: [
          { key: "source1", name: "Lecture Notes" },
          { key: "source2", name: "Textbook References" }
        ]
      },
      {
        key: "internal-medicine",
        name: "Internal Medicine",
        lectures: [
          {
            title: "Cardiology",
            topics: [
              { title: "Heart failure" },
              { title: "Arrhythmias" }
            ]
          }
        ],
        sources: [
          { key: "source1", name: "Clinical Guidelines" },
          { key: "source2", name: "Research Papers" }
        ]
      }
    ]
  };
  
  if (!fs.existsSync(qbankStructureFile)) {
    fs.writeFileSync(qbankStructureFile, JSON.stringify(defaultStructure, null, 2), 'utf8');
    console.log('✅ Created data/qbank-structure.json with default structure');
  } else {
    console.log('✅ data/qbank-structure.json already exists');
  }
  
  // Create qbank-questions.json
  const qbankQuestionsFile = path.join(dataDir, 'qbank-questions.json');
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
        correct: "Cardiac output increases by 30-50% during pregnancy to meet the increased metabolic demands of the mother and fetus.",
        incorrect: [
          "Heart rate actually increases during pregnancy, not decreases.",
          "Blood volume increases significantly during pregnancy.",
          "Blood pressure typically decreases in the second trimester."
        ],
        educationalObjective: "Understand the cardiovascular adaptations during pregnancy."
      }
    },
    {
      id: 2,
      subject: "obgyn",
      source: "Textbook References",
      sourceKey: "source2",
      lecture: "Medical Disorders in Pregnancy",
      topic: "D.M. in pregnancy",
      question: "Which of the following is the most appropriate initial management for gestational diabetes?",
      options: [
        "Immediate insulin therapy",
        "Dietary modification and exercise",
        "Oral hypoglycemic agents",
        "Hospitalization for monitoring"
      ],
      correctAnswer: 1,
      explanation: {
        correct: "Dietary modification and exercise are the first-line treatment for gestational diabetes, with good glycemic control achieved in most cases.",
        incorrect: [
          "Insulin is reserved for cases where diet and exercise fail to control glucose levels.",
          "Oral hypoglycemics are generally avoided in pregnancy due to potential fetal effects.",
          "Hospitalization is not routinely required for gestational diabetes management."
        ],
        educationalObjective: "Identify appropriate management strategies for gestational diabetes."
      }
    }
  ];
  
  if (!fs.existsSync(qbankQuestionsFile)) {
    fs.writeFileSync(qbankQuestionsFile, JSON.stringify(defaultQuestions, null, 2), 'utf8');
    console.log('✅ Created data/qbank-questions.json with sample questions');
  } else {
    console.log('✅ data/qbank-questions.json already exists');
  }
  
  console.log('\n🎉 SUBSCRIPTION SYSTEM SETUP COMPLETE!');
  console.log('\n📁 Created files:');
  console.log('   • data/subscriptions.json - Stores user subscription data');
  console.log('   • data/qbank-structure.json - Qbank subjects, lectures, topics');
  console.log('   • data/qbank-questions.json - Qbank questions database');
  
  console.log('\n✅ Your application now supports:');
  console.log('   🔐 Subscription management (trial/subscription)');
  console.log('   📚 Qbank question management');
  console.log('   📝 CSV import functionality');
  console.log('   👥 User access control');
  
  console.log('\n🚀 Ready to test the admin panel!');
}

setupSubscriptionSystem().catch(console.error);
