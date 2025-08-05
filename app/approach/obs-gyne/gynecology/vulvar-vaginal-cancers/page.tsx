'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function VulvarVaginalCancersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Check authentication
  if (!isLoading && !user) {
    router.push('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-pink-50 to-purple-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 shadow-sm flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-bold text-purple-600">Vulvar/Vaginal Cancers</h1>
      </div>

      {/* Main Content */}
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Coming Soon</h1>
          <p className="text-2xl text-gray-600 max-w-lg mx-auto">
            Vulvar and Vaginal Cancer diagnosis and management content will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
} 