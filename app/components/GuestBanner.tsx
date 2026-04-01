'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export function GuestBanner() {
  const { isGuest } = useAuth();

  if (!isGuest) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center">
      <p className="text-sm text-amber-300">
        You are browsing as a <strong>Guest</strong>. Only Wizary Exam is available.{' '}
        <Link
          href="/signup"
          className="underline text-amber-200 hover:text-white font-medium transition-colors"
        >
          Register
        </Link>{' '}
        for full access.
      </p>
    </div>
  );
}
