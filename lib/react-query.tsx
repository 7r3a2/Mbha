'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,      // 5 minutes — data is fresh for longer
            gcTime: 30 * 60 * 1000,         // 30 minutes — keep inactive data in memory
            retry: 1,
            refetchOnWindowFocus: false,     // Don't refetch when user switches tabs
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
