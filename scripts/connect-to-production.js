const fs = require('fs');

async function connectToProduction() {
  try {
    console.log('🚀 Connecting to your production database with 26 users...');
    
    const envContent = `# Created by Vercel CLI
DATABASE_URL="postgres://f3fdaf8eecd12fcbe0b348c00d5340b5df04159b3f27eff8c5ab3c072c7eb33e:sk_47by-oCJUV4Ry7CuwiTbb@db.prisma.io:5432/?sslmode=require"

JWT_SECRET="89489c73f3e3fcf85aad1aa871ab19a781468dbd5e09deaca1d5ba11d66caae564806cb140fd34754e9c0d73d21b17b68ce6001fa380"

POSTGRES_URL="postgres://f3fdaf8eecd12fcbe0b348c00d5340b5df04159b3f27eff8c5ab3c072c7eb33e:sk_47by-oCJUV4Ry7CuwiTbb@db.prisma.io:5432/?sslmode=require"

PRISMA_DATABASE_URL="postgres://f3fdaf8eecd12fcbe0b348c00d5340b5df04159b3f27eff8c5ab3c072c7eb33e:sk_47by-oCJUV4Ry7CuwiTbb@db.prisma.io:5432/?sslmode=require"

VERCEL_OIDC_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1yay00MzAyZWMxYjY3MGY0OGE5OGFkNjFkYWRlNGEyMzJlNyJ9.eyJpc3MiOiJodHRwczovL29pZGMudmVyY2VsLmNvbS83cjNhYXMtcHJvamVjdHMiLCJzdWIiOiJvd25lcjo3cjNhYXMtcHJvamVjdHM6cHJvamVjdDptYmhhLXdlYnNpdGUtdjE6ZW52aXJvbm1lbnQ6ZGV2ZWxvcG1lbnQiLCJzY29wZSI6Im93bmVyOjdyM2Fhcy1wcm9qZWN0czpwcm9qZWN0Om1iaGEtd2Vic2l0ZS12MTplbnZpcm9ubWVudDpkZXZlbG9wbWVudCIsImF1ZCI6Imh0dHBzOi8vdmVyY2VsLmNvbS83cjNhYXMtcHJvamVjdHMiLCJvd25lciI6IjdyM2Fhcy1wcm9qZWN0cyIsIm93bmVyX2lkIjoidGVhbV9LbWluell0VlNMOE1Xb0tOWDlpMzNSWGEiLCJwcm9qZWN0IjoibWJoYS13ZWJzaXRlLXYxIiwicHJvamVjdF9pZCI6InByal9xdGRmOVdSYnRSc0NKMWtOYUxQVFNtdHpicnJhIiwiZW52aXJvbm1lbnQiOiJkZXZlbG9wbWVudCIsInVzZXJfaWQiOiIzejVoQWk2a3cxRkRyeURGa05rdUFXaXAiLCJuYmYiOjE3NTQxMzAxNzksImlhdCI6MTc1NDEzMDE3OSwiZXhwIjoxNzU0MTczMzc5fQ.nIdL2v3PyEMBRsrpbuvAup4pq_CYyU1Sbgf67nApCMz617iMSB2vvZPPjQZIw2fuodPeBKU_pFtOfQXO1gBMswidtTHf2DobDsBrh4TfdqQyhyLWJKgreaPDWv9DKafyIU509WLSAKMq4AOFXjQEW2RG--KL1ib-1kn-pDnDYXK_HHPz47BIoDQY2cvfohpjSktFVKJe8wQvVczx9H1PRv9HgK6CROLEPVQSRTHS3FZ-FDN0DZ5viwat5g_lFx0jymL89_0EJ7JdB90P-XtBDqlHsUU"`;

    fs.writeFileSync('.env.local', envContent);
    console.log('✅ Connected to your production database!');
    console.log('📋 Using direct PostgreSQL connection (not Prisma Accelerate)');
    console.log('🎯 This should now show your 26 users!');
    
  } catch (error) {
    console.error('❌ Error connecting to production:', error);
  }
}

connectToProduction();
