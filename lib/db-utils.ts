import bcrypt from 'bcryptjs';
import { prisma } from './simple-db';

// Password utility functions
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Key-Value helpers for JSON persistence in Postgres
export const kvGet = async <T = any>(key: string, fallback: T): Promise<T> => {
  try {
    const row = await prisma.keyValue.findUnique({ where: { key } });
    if (!row) return fallback;
    return (row.value as unknown as T) ?? fallback;
  } catch {
    return fallback;
  }
};

export const kvSet = async (key: string, value: any) => {
  await prisma.keyValue.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
};

// User functions
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

// Unique code functions
export const findUniqueCode = async (code: string) => {
  return prisma.uniqueCode.findUnique({
    where: { code },
  });
};

export const markCodeAsUsed = async (code: string, userId: string) => {
  return prisma.uniqueCode.update({
    where: { code },
    data: {
      used: true,
    },
  });
};

// Exam functions
export const getAllExams = async () => {
  return prisma.exam.findMany({
    orderBy: [
      { subject: 'asc' },
      { order: 'asc' },
    ],
  });
};

export const createExam = async (examData: {
  title: string;
  subject: string;
  examTime: number;
  secretCode: string;
  questions: string;
}) => {
  return prisma.exam.create({
    data: {
      title: examData.title,
      subject: examData.subject,
      examTime: examData.examTime,
      secretCode: examData.secretCode,
      questions: examData.questions,
      order: 1, // Default order
    },
  });
};

export const deleteExamAdmin = async (examId: string) => {
  return prisma.exam.delete({
    where: { id: examId },
  });
};

// Admin functions
export const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: { id: userId },
  });
};

export const updateUserPassword = async (userId: string, newPassword: string) => {
  console.log('🔐 updateUserPassword called for user ID:', userId);
  console.log('📋 New password length:', newPassword.length);
  
  const hashedPassword = await hashPassword(newPassword);
  console.log('🔑 Generated hash length:', hashedPassword.length);
  console.log('🔑 Generated hash starts with:', hashedPassword.substring(0, 10) + '...');
  
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
  
  console.log('✅ Password updated in database for user:', updatedUser.email);
  console.log('📅 Updated at:', updatedUser.updatedAt);
  
  return updatedUser;
};

export const getAllUniqueCodes = async () => {
  return prisma.uniqueCode.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateNewCodes = async (count: number) => {
  try {
    console.log(`🚀 Starting to generate ${count} random codes...`);
    
    const codes = [];
    const usedCodes = new Set();
    
    // Generate unique random codes
    for (let i = 0; i < count; i++) {
      let randomCode;
      let attempts = 0;
      
      // Ensure uniqueness within this batch
      do {
        randomCode = generateRandomCode();
        attempts++;
      } while (usedCodes.has(randomCode) && attempts < 100);
      
      if (attempts >= 100) {
        console.warn('⚠️ Could not generate unique code after 100 attempts');
        continue;
      }
      
      usedCodes.add(randomCode);
      codes.push({
        code: randomCode,
        used: false,
      });
    }
    
    console.log('📋 Random codes to create:', codes.map(c => c.code));
    
    // Try to create all codes at once
    try {
      const result = await prisma.uniqueCode.createMany({
        data: codes,
      });
      
      console.log(`✅ Successfully created ${result.count} random codes`);
      return codes.slice(0, result.count);
    } catch (batchError) {
      console.log('⚠️ Batch create failed, trying individual creates...');
      
      // Fallback: create one by one
      const createdCodes = [];
      for (const codeData of codes) {
        try {
          const created = await prisma.uniqueCode.create({
            data: codeData
          });
          createdCodes.push(created);
        } catch (individualError) {
          console.log(`❌ Code ${codeData.code} already exists, generating new one...`);
          
          // Try with a new random code
          let newRandomCode;
          let attempts = 0;
          do {
            newRandomCode = generateRandomCode();
            attempts++;
            try {
              const newCreated = await prisma.uniqueCode.create({
                data: { code: newRandomCode, used: false }
              });
              createdCodes.push(newCreated);
              console.log(`✅ Created new code: ${newRandomCode}`);
              break;
            } catch {
              // Continue trying
            }
          } while (attempts < 10);
        }
      }
      
      console.log(`✅ Created ${createdCodes.length} codes individually`);
      return createdCodes;
    }
  } catch (error: any) {
    console.error('💥 Critical error in generateNewCodes:', error);
    throw new Error(`Failed to generate codes: ${error.message}`);
  }
};

export default prisma;