import React from 'react';
import { RouteGuard } from '@/components/common/RouteGuard';
import { Flame } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requireAuth={false}>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-orange-50/70 px-4 py-12 dark:bg-zinc-900">

        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/3 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/20 blur-3xl dark:bg-orange-700/10" />
          <div className="absolute right-1/4 bottom-0 h-80 w-80 translate-x-1/2 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-700/10" />
        </div>

        <div className="relative z-10 w-full max-w-md space-y-8">
          {/* Brand mark */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-xl shadow-orange-500/30">
              <Flame className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <h2
              className="text-center text-3xl font-extrabold text-stone-900 dark:text-orange-50"
              style={{ fontFamily: "'Playfair Display SC', Georgia, serif" }}
            >
              BiteBot
            </h2>
            <p className="text-center text-sm text-stone-500 dark:text-stone-400">
              Your AI-powered kitchen companion
            </p>
          </div>

          {/* Auth card */}
          <div className="rounded-2xl border border-orange-100 bg-white p-8 shadow-xl shadow-orange-900/8 dark:border-orange-950/40 dark:bg-stone-900">
            {children}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
