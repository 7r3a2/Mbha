import { kvGet, kvSet } from './kv.repository';

interface SubscriptionMap {
  [userId: string]: {
    expiresAt: string;
  };
}

export const getSubscriptions = async (): Promise<SubscriptionMap> => {
  return kvGet<SubscriptionMap>('subscriptions', {});
};

export const getUserSubscription = async (userId: string) => {
  const subs = await getSubscriptions();
  return subs[userId] || null;
};

export const setUserSubscription = async (userId: string, expiresAt: string) => {
  const subs = await getSubscriptions();
  subs[userId] = { expiresAt };
  await kvSet('subscriptions', subs);
};

export const removeUserSubscription = async (userId: string) => {
  const subs = await getSubscriptions();
  delete subs[userId];
  await kvSet('subscriptions', subs);
};
