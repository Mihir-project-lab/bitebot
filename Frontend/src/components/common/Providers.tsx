'use client';

import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/lib/api/query-client';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster 
        richColors 
        closeButton 
        position="top-right" 
        theme="light" // Will adjust to user light/dark modes
      />
    </QueryClientProvider>
  );
}
