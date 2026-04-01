import {
  getSubscriptions,
  getUserSubscription,
  setUserSubscription,
  removeUserSubscription,
} from '../repositories/subscription.repository';

export { getSubscriptions, getUserSubscription, removeUserSubscription };

export async function grantSubscription(
  userId: string,
  duration: { months?: number; amount?: number; unit?: string }
) {
  const { months, amount, unit } = duration;

  const now = new Date();
  const expires = new Date(now);

  if (months && months > 0) {
    expires.setMonth(expires.getMonth() + months);
  } else if (amount && amount > 0 && unit) {
    switch (unit.toLowerCase()) {
      case 'day':
      case 'days':
        expires.setDate(expires.getDate() + amount);
        break;
      case 'week':
      case 'weeks':
        expires.setDate(expires.getDate() + amount * 7);
        break;
      case 'month':
      case 'months':
        expires.setMonth(expires.getMonth() + amount);
        break;
      case 'year':
      case 'years':
        expires.setFullYear(expires.getFullYear() + amount);
        break;
      default:
        throw new Error('Invalid unit. Use day/week/month/year');
    }
  } else {
    throw new Error('Invalid duration');
  }

  const expiresAt = expires.toISOString();
  await setUserSubscription(userId, expiresAt);

  return { userId, expiresAt };
}

export function computeTrialStatus(createdAt: Date) {
  const now = new Date();
  const trialEnds = new Date(createdAt);
  trialEnds.setDate(trialEnds.getDate() + 3);
  const trialActive = now < trialEnds;

  return { trialActive, trialEndsAt: trialEnds.toISOString() };
}

export async function computeUserAccess(userId: string, createdAt: Date) {
  const trial = computeTrialStatus(createdAt);
  const sub = await getUserSubscription(userId);
  const subActive = sub ? new Date() < new Date(sub.expiresAt) : false;
  const hasFullAccess = trial.trialActive || subActive;

  return {
    hasWizaryExamAccess: true,
    hasApproachAccess: hasFullAccess,
    hasQbankAccess: hasFullAccess,
    hasCoursesAccess: hasFullAccess,
    subscriptionActive: subActive,
    subscriptionExpiresAt: sub?.expiresAt || null,
    ...trial,
  };
}
