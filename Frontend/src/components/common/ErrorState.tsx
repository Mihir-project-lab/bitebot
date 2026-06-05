import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading this section. Please try again.',
  onRetry,
  retryLabel = 'Retry Request',
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200/60 bg-red-50/10 p-8 text-center dark:border-red-900/30 dark:bg-red-950/5">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-650 dark:bg-red-950/40 dark:text-red-400 mb-4">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
        {description}
      </p>
      {onRetry && (
        <div className="mt-6">
          <Button onClick={onRetry} variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20">
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
