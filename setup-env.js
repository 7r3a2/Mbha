const { execSync } = require('child_process');

console.log('🔧 Setting up environment variables...');

try {
  // Add DATABASE_URL
  console.log('📊 Adding DATABASE_URL...');
  execSync('vercel env add DATABASE_URL "postgres://f3fdaf8eecd12fcbe0b348c00d5340b5df04159b3f27eff8c5ab3c072c7eb33e:sk_47by-oCJUV4Ry7CuwiTbb@db.prisma.io:5432/?sslmode=require"', { stdio: 'inherit' });
  
  // Add JWT_SECRET
  console.log('🔐 Adding JWT_SECRET...');
  execSync('vercel env add JWT_SECRET "your-super-secret-jwt-key-here-2024"', { stdio: 'inherit' });
  
  console.log('✅ Environment variables added successfully!');
  console.log('🚀 Now visit: https://mbha-website-v1-nfsi4r5aq-7r3aas-projects.vercel.app/api/setup-database');
  
} catch (error) {
  console.error('❌ Error setting up environment variables:', error.message);
} 