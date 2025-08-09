const fs = require('fs');

console.log('🔧 Updating local environment to use PostgreSQL...\n');

const envContent = `DATABASE_URL="postgres://d569856ba8ee9306364e2daf2726c7c908f1b316044822529dd2588f18b89a32:sk_xzcY2FjVmLYG1Ojf8I3cn@db.prisma.io:5432/?sslmode=require"
JWT_SECRET="89489c73f3e3fcf85aad1aa871ab19a781468dbd5e09deaca1d5ba11d66caae564806cb140fd34754e9c0d73d21b17b68ce6001fa380"`;

fs.writeFileSync('.env.local', envContent);

console.log('✅ Updated .env.local with PostgreSQL connection');
console.log('✅ Now you can connect to your production database locally');
console.log('\n🔄 Next: Run the database check script...');
