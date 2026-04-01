import { prisma } from '../prisma';
import { hashPassword } from '../crypto';

export const createUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender?: string;
  university?: string;
  uniqueCode: string;
}) => {
  const hashedPassword = await hashPassword(userData.password);

  return prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      gender: true,
      university: true,
      uniqueCode: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      hasApproachAccess: true,
      hasCoursesAccess: true,
      hasQbankAccess: true,
      hasWizaryExamAccess: true,
      isLocked: true,
      lastLoginAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: { id: userId },
  });
};

export const updateUserPassword = async (userId: string, newPassword: string) => {
  const hashedPassword = await hashPassword(newPassword);

  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};
