const https = require('https');

console.log('🚀 Setting up database automatically...');

// Function to make HTTP request
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'mbha-website-v1-bnchj3e5x-haideralaas-projects.vercel.app',
      port: 443,
      path: url,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve(result);
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function setupDatabase() {
  try {
    console.log('📊 Step 1: Testing database connection...');
    const testResult = await makeRequest('/api/test-connection');
    console.log('Test result:', testResult);

    console.log('🔧 Step 2: Setting up database schema...');
    const setupResult = await makeRequest('/api/setup-database');
    console.log('Setup result:', setupResult);

    console.log('✅ Database setup completed!');
    console.log('🎯 Admin codes:', setupResult.adminCodes);
    console.log('👤 User codes:', setupResult.userCodes);
    
    console.log('\n🚀 Next steps:');
    console.log('1. Go to: https://mbha-website-v1-bnchj3e5x-haideralaas-projects.vercel.app/');
    console.log('2. Click "Login" then "Sign Up"');
    console.log('3. Use admin code: ADMIN2024');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Manual setup required:');
    console.log('1. Go to: https://mbha-website-v1-bnchj3e5x-haideralaas-projects.vercel.app/api/setup-database');
    console.log('2. Then register with: ADMIN2024');
  }
}

setupDatabase(); 