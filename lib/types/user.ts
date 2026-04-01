export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  GUEST = 'guest',
}

export interface JWTPayload {
  userId: string;
  role: UserRole;
  email?: string;
  sessionId?: string;
  iat?: number;
  exp?: number;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string | null;
  university: string | null;
  uniqueCode: string;
  role: string;
  hasWizaryExamAccess: boolean;
  hasApproachAccess: boolean;
  hasQbankAccess: boolean;
  hasCoursesAccess: boolean;
  isLocked: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithAccess extends UserProfile {
  trialActive: boolean;
  trialEndsAt: string;
  subscriptionActive: boolean;
  subscriptionExpiresAt: string | null;
  isAdmin: boolean;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender?: string;
  university?: string;
  uniqueCode: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
