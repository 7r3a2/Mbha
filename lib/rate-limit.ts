import { prisma } from './prisma';

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const now = new Date();

  try {
    // Try to find existing rate limit entry
    const entry = await prisma.rateLimit.findUnique({
      where: { id: key },
    });

    // If no entry or entry has expired, create/reset it
    if (!entry || entry.resetAt < now) {
      await prisma.rateLimit.upsert({
        where: { id: key },
        create: {
          id: key,
          count: 1,
          resetAt: new Date(Date.now() + windowMs),
        },
        update: {
          count: 1,
          resetAt: new Date(Date.now() + windowMs),
        },
      });
      return { allowed: true };
    }

    // Increment count
    const updated = await prisma.rateLimit.update({
      where: { id: key },
      data: { count: { increment: 1 } },
    });

    if (updated.count > limit) {
      const retryAfter = Math.ceil((entry.resetAt.getTime() - Date.now()) / 1000);
      return { allowed: false, retryAfter: Math.max(retryAfter, 1) };
    }

    return { allowed: true };
  } catch {
    // If DB fails, allow the request (fail-open) to avoid blocking legitimate users
    return { allowed: true };
  }
}

// Clean up expired rate limit entries (call periodically or via cron)
export async function cleanupExpiredRateLimits(): Promise<void> {
  try {
    await prisma.rateLimit.deleteMany({
      where: {
        resetAt: { lt: new Date() },
      },
    });
  } catch {
    // Silently fail cleanup
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  return 'unknown';
}
