// Re-export from the new database module for backward compatibility
export { prisma, checkDatabaseConnection, disconnectDatabase, withRetry } from './database';