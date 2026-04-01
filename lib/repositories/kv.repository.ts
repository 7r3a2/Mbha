import { prisma } from '../prisma';

export const kvGet = async <T = unknown>(key: string, fallback: T): Promise<T> => {
  try {
    const row = await prisma.keyValue.findUnique({ where: { key } });
    if (!row) return fallback;
    return (row.value as unknown as T) ?? fallback;
  } catch {
    return fallback;
  }
};

export const kvSet = async (key: string, value: unknown) => {
  await prisma.keyValue.upsert({
    where: { key },
    update: { value: value as any },
    create: { key, value: value as any },
  });
};
