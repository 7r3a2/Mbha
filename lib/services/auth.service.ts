import { findUserByEmail, findUserById } from '../repositories/user.repository';
import { findUniqueCode, markCodeAsUsed } from '../repositories/code.repository';
import { getUserSubscription } from '../repositories/subscription.repository';
import { verifyPassword, hashPassword } from '../crypto';
import { signToken, verifyToken } from '../jwt';
import { prisma } from '../prisma';
import { validateSession } from '../session-utils';
import { UserRole } from '../types/user';
import type { RegisterInput } from '../types/user';

const ADMIN_EMAILS = ['admin@mbha.com', 'admin@mbha.net'];
const ADMIN_CODE = 'ADMIN2024';

export function isAdmin(user: { email: string; uniqueCode: string; role?: string }): boolean {
  return (
    user.role === 'admin' ||
    ADMIN_EMAILS.includes(user.email) ||
    user.uniqueCode === ADMIN_CODE
  );
}

export async function loginUser(email: string, password: string) {
  if (!email || !password) {
    throw new ServiceError('Email and password are required', 400);
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new ServiceError('Invalid credentials', 401);
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw new ServiceError('Invalid credentials', 401);
  }

  const admin = isAdmin(user);

  if (!admin && user.isLocked) {
    throw new ServiceError(
      'Your account is locked. Please contact the developer to unlock your account.',
      423
    );
  }

  const role = admin ? UserRole.ADMIN : UserRole.USER;
  const token = signToken({ userId: user.id, role, email: user.email });

  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: {
      ...userWithoutPassword,
      isAdmin: admin,
    },
  };
}

export async function registerUser(data: RegisterInput) {
  const { firstName, lastName, email, password, gender, university, uniqueCode } = data;

  if (!firstName || !lastName || !email || !password || !uniqueCode) {
    throw new ServiceError('Missing required fields', 400);
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ServiceError('User with this email already exists', 400);
  }

  const codeRecord = await findUniqueCode(uniqueCode);
  if (!codeRecord) {
    throw new ServiceError('Invalid registration code', 400);
  }
  if (codeRecord.used) {
    throw new ServiceError('Registration code has already been used', 400);
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      university,
      uniqueCode,
    },
  });

  await markCodeAsUsed(uniqueCode, user.id);

  const token = signToken({ userId: user.id, role: UserRole.USER, email: user.email });
  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
}

export async function verifyUserToken(token: string) {
  if (!token) return null;

  let user = null;

  const decoded = verifyToken(token);
  if (decoded) {
    // Handle guest tokens
    if (decoded.role === UserRole.GUEST) {
      return {
        valid: true,
        user: {
          id: decoded.userId,
          firstName: 'Guest',
          lastName: '',
          email: '',
          role: 'guest',
          hasWizaryExamAccess: true,
          hasApproachAccess: false,
          hasQbankAccess: false,
          hasCoursesAccess: false,
          isGuest: true,
        },
      };
    }

    if (decoded.userId) {
      user = await findUserById(decoded.userId);
    }
    if (!user && decoded.sessionId) {
      const result = await validateSession(decoded.sessionId);
      if (result.valid && result.user) {
        user = result.user;
      }
    }
  } else {
    // Try as session ID
    try {
      const result = await validateSession(token);
      if (result.valid && result.user) {
        user = result.user;
      }
    } catch {
      // Both failed
    }
  }

  if (!user) return null;

  // Compute trial and subscription access
  const createdAt = new Date(user.createdAt);
  const now = new Date();
  const trialEnds = new Date(createdAt);
  trialEnds.setDate(trialEnds.getDate() + 3);
  const trialActive = now < trialEnds;

  const sub = await getUserSubscription(user.id);
  const subActive = sub ? now < new Date(sub.expiresAt) : false;

  const hasFullAccess = trialActive || subActive;

  return {
    valid: true,
    user: {
      ...user,
      hasWizaryExamAccess: true,
      hasApproachAccess: hasFullAccess,
      hasQbankAccess: hasFullAccess,
      hasCoursesAccess: hasFullAccess,
      subscriptionActive: subActive,
      subscriptionExpiresAt: sub?.expiresAt || null,
      trialActive,
      trialEndsAt: trialEnds.toISOString(),
    },
  };
}

export class ServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}
