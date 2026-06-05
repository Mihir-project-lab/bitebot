'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function RouteGuard({ children, requireAuth = true }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      // User is not authenticated, redirect to login
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (!requireAuth && isAuthenticated) {
      // User is authenticated but on auth pages, redirect to dashboard
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, requireAuth, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <LoadingSkeleton className="h-12 w-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Loading BiteBot...</p>
        </div>
      </div>
    );
  }

  // Prevent rendering protected content if not authorized
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Prevent rendering auth forms if already logged in
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
