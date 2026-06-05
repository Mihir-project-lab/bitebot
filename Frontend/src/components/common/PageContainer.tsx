import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide' | 'full';
}

export function PageContainer({
  children,
  className,
  size = 'default',
  ...props
}: PageContainerProps) {
  const maxWidthClass = {
    narrow: 'max-w-3xl',
    default: 'max-w-5xl',
    wide: 'max-w-7xl',
    full: 'max-w-full',
  }[size];

  return (
    <div
      className={cn(
        'mx-auto w-full px-4 py-6 sm:px-6 md:py-8 lg:px-8 animate-in fade-in slide-in-from-bottom-3 duration-300',
        maxWidthClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
