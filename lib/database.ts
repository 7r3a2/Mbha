import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Database connection configuration
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL,
      },
    },
  });
};

// Export the Prisma client with connection pooling
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Database connection health check
export const checkDatabaseConnection = async (): Promise<{
  success: boolean;
  error?: string;
  databaseType?: string;
}> => {
  try {
    // Test the connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
    
    // Determine database type
    let databaseType = 'Unknown';
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL;
    
    if (databaseUrl?.includes('accelerate.prisma-data.net')) {
      databaseType = 'Prisma Accelerate (Production)';
    } else if (databaseUrl?.includes('db.prisma.io')) {
      databaseType = 'Direct PostgreSQL (Production)';
    } else if (databaseUrl?.includes('postgresql://')) {
      databaseType = 'PostgreSQL';
    } else if (databaseUrl?.includes('file:')) {
      databaseType = 'SQLite';
    } else {
      databaseType = 'Local/Other Database';
    }

    return {
      success: true,
      databaseType,
    };
  } catch (error: any) {
    console.error('❌ Database connection failed:', error);
    return {
      success: false,
      error: error.message || 'Database connection failed',
    };
  }
};

// Graceful shutdown
export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected gracefully');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error);
  }
};

// Connection retry logic
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      console.warn(`⚠️ Database operation failed (attempt ${attempt}/${maxRetries}):`, error.message);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError!;
};

export default prisma;
