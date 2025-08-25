import { prisma } from './prisma';
import { NextRequest } from 'next/server';
import crypto from 'crypto';

// Generate a unique session ID
export const generateSessionId = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Get device info from request
export const getDeviceInfo = (request: NextRequest): string => {
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const deviceInfo = {
    userAgent: userAgent.substring(0, 100), // Limit length
    timestamp: new Date().toISOString()
  };
  return JSON.stringify(deviceInfo);
};

// Get IP address from request
export const getIpAddress = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  return 'Unknown';
};

// Check if user has active sessions
export const checkUserSessions = async (userId: string): Promise<{ activeSessions: number; shouldLock: boolean }> => {
  const now = new Date();
  
  // Get all active sessions for the user
  const activeSessions = await prisma.userSession.findMany({
    where: {
      userId,
      isActive: true,
      expiresAt: {
        gt: now
      }
    }
  });

  const activeCount = activeSessions.length;
  const shouldLock = activeCount > 1; // Lock if more than 1 active session

  return { activeSessions: activeCount, shouldLock };
};

// Create a new session for user
export const createUserSession = async (
  userId: string, 
  request: NextRequest,
  sessionDuration: number = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
): Promise<string> => {
  const sessionId = generateSessionId();
  const deviceInfo = getDeviceInfo(request);
  const ipAddress = getIpAddress(request);
  const expiresAt = new Date(Date.now() + sessionDuration);

  await prisma.userSession.create({
    data: {
      userId,
      sessionId,
      deviceInfo,
      ipAddress,
      expiresAt
    }
  });

  return sessionId;
};

// Validate session
export const validateSession = async (sessionId: string): Promise<{ valid: boolean; user?: any }> => {
  const now = new Date();
  
  const session = await prisma.userSession.findFirst({
    where: {
      sessionId,
      isActive: true,
      expiresAt: {
        gt: now
      }
    },
    include: {
      user: true
    }
  });

  if (!session) {
    return { valid: false };
  }

  // Check if user is locked
  if (session.user.isLocked) {
    return { valid: false };
  }

  return { valid: true, user: session.user };
};

// Deactivate session
export const deactivateSession = async (sessionId: string): Promise<void> => {
  await prisma.userSession.updateMany({
    where: {
      sessionId,
      isActive: true
    },
    data: {
      isActive: false
    }
  });
};

// Deactivate all sessions for a user
export const deactivateAllUserSessions = async (userId: string): Promise<void> => {
  await prisma.userSession.updateMany({
    where: {
      userId,
      isActive: true
    },
    data: {
      isActive: false
    }
  });
};

// Lock user account
export const lockUserAccount = async (userId: string): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: { 
      isLocked: true,
      lastLoginAt: new Date()
    }
  });
};

// Unlock user account
export const unlockUserAccount = async (userId: string): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: { 
      isLocked: false,
      lastLoginAt: new Date()
    }
  });
};

// Clean up expired sessions
export const cleanupExpiredSessions = async (): Promise<void> => {
  const now = new Date();
  
  await prisma.userSession.updateMany({
    where: {
      expiresAt: {
        lt: now
      },
      isActive: true
    },
    data: {
      isActive: false
    }
  });
};
