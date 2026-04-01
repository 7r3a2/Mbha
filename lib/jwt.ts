import jwt from 'jsonwebtoken';
import { JWTPayload, UserRole } from './types/user';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
}

export const signToken = (
  payload: { userId: string; role?: UserRole; email?: string; sessionId?: string },
  expiresIn: string = '7d'
): string => {
  const tokenPayload = {
    userId: payload.userId,
    role: payload.role || UserRole.USER,
    ...(payload.email && { email: payload.email }),
    ...(payload.sessionId && { sessionId: payload.sessionId }),
  };

  return jwt.sign(tokenPayload, getJwtSecret(), { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
      return decoded as JWTPayload;
    }
    return null;
  } catch {
    return null;
  }
};
