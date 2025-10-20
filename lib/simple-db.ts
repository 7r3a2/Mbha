import { PrismaClient } from '@prisma/client';

// Simple database connection without complex retry logic
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Simple connection test
export const testConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { success: true };
  } catch (error: any) {
    console.error('❌ Database connection test failed:', error);
    return { success: false, error: error.message };
  }
};

export default prisma;
