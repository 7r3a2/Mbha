import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  }).$extends(withAccelerate());
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const checkDatabaseConnection = async (): Promise<{
  success: boolean;
  error?: string;
  databaseType?: string;
}> => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    let databaseType = 'Unknown';
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL;

    if (databaseUrl?.includes('accelerate.prisma-data.net')) {
      databaseType = 'Prisma Accelerate (Production)';
    } else if (databaseUrl?.includes('postgresql://') || databaseUrl?.includes('postgres://')) {
      databaseType = 'PostgreSQL';
    } else {
      databaseType = 'Local/Other Database';
    }

    return { success: true, databaseType };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database connection failed';
    return { success: false, error: message };
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error = new Error('Operation failed');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
};

export default prisma;
