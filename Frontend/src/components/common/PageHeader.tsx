import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action, className, ...props }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col gap-4 border-b border-orange-100 pb-6 dark:border-orange-950/30 md:flex-row md:items-end md:justify-between',
        className,
      )}
      {...props}
    >
      <div className="space-y-1.5">
        <h1
          className="text-2xl font-extrabold tracking-tight text-stone-900 dark:text-orange-50 sm:text-3xl"
          style={{ fontFamily: "'Playfair Display SC', Georgia, serif" }}
        >
          {title}
        </h1>
        {description && (
          <p className="text-sm text-stone-500 dark:text-stone-400">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex shrink-0 items-center gap-3">{action}</div>
      )}
    </div>
  );
}
