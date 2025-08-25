const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('🔧 Setting up PostgreSQL database...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Check if UserResponse table exists
    try {
      const responses = await prisma.userResponse.findMany({ take: 1 });
      console.log('✅ UserResponse table exists');
    } catch (error) {
      console.log('❌ UserResponse table not found, creating schema...');
      console.log('Please run: npx prisma db push');
      return;
    }
    
    // Check for existing users
    const users = await prisma.user.findMany();
    console.log(`📊 Found ${users.length} users in database`);
    
    // Check for existing user responses
    const responses = await prisma.userResponse.findMany();
    console.log(`📝 Found ${responses.length} user responses in database`);
    
    if (responses.length > 0) {
      console.log('📋 Sample responses:');
      responses.slice(0, 3).forEach(response => {
        console.log(`  - Question: ${response.questionId}, User: ${response.userId}, Correct: ${response.isCorrect}, Flagged: ${response.isFlagged}`);
      });
    }
    
    console.log('✅ Database setup complete!');
    console.log('🚀 You can now test the quiz functionality');
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
    console.log('💡 Make sure your PRISMA_DATABASE_URL is set correctly in .env.local');
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase(); 