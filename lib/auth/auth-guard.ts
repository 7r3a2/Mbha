import { NextRequest } from 'next/server';

export interface AuthUser {
  userId: string;
  role: string;
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  const userId = request.headers.get('x-user-id');
  const role = request.headers.get('x-user-role');

  if (!userId) return null;

  return { userId, role: role || 'user' };
}

export function requireAuth(request: NextRequest): AuthUser {
  const user = getAuthUser(request);
  if (!user) {
    throw new AuthError('Unauthorized', 401);
  }
  return user;
}

export function requireAdmin(request: NextRequest): AuthUser {
  const user = requireAuth(request);
  if (user.role !== 'admin') {
    throw new AuthError('Forbidden', 403);
  }
  return user;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
