import { prisma } from '../prisma';

export const findUniqueCode = async (code: string) => {
  return prisma.uniqueCode.findUnique({
    where: { code },
  });
};

export const markCodeAsUsed = async (code: string, userId: string) => {
  return prisma.uniqueCode.update({
    where: { code },
    data: { used: true },
  });
};

export const getAllUniqueCodes = async () => {
  return prisma.uniqueCode.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

const generateRandomCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateNewCodes = async (count: number) => {
  const codes = [];
  const usedCodes = new Set<string>();

  for (let i = 0; i < count; i++) {
    let randomCode: string;
    let attempts = 0;

    do {
      randomCode = generateRandomCode();
      attempts++;
    } while (usedCodes.has(randomCode) && attempts < 100);

    if (attempts >= 100) continue;

    usedCodes.add(randomCode);
    codes.push({ code: randomCode, used: false });
  }

  try {
    const result = await prisma.uniqueCode.createMany({ data: codes });
    return codes.slice(0, result.count);
  } catch {
    // Fallback: create one by one
    const createdCodes = [];
    for (const codeData of codes) {
      try {
        const created = await prisma.uniqueCode.create({ data: codeData });
        createdCodes.push(created);
      } catch {
        // Code already exists, try a new one
        for (let attempts = 0; attempts < 10; attempts++) {
          const newCode = generateRandomCode();
          try {
            const created = await prisma.uniqueCode.create({
              data: { code: newCode, used: false },
            });
            createdCodes.push(created);
            break;
          } catch {
            // Continue trying
          }
        }
      }
    }
    return createdCodes;
  }
};
