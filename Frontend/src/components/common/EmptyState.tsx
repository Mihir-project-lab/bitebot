import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-350 p-8 text-center dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-450 dark:bg-zinc-900 dark:text-zinc-550 mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-450 max-w-sm">
        {description}
      </p>
      {action && (
        <div className="mt-6">
          <Button onClick={action.onClick} variant="outline" size="sm">
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
