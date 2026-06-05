'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronRight, Home } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';

interface NavbarProps {
  onMenuToggle: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const crumbs = paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/');
      const name = path
        .replace(/-/g, ' ')
        .replace(/\[|\]/g, '')
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return { name, href };
    });
    return [{ name: 'Home', href: '/dashboard' }, ...crumbs];
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-orange-100 bg-orange-50/80 backdrop-blur-md px-6 dark:border-orange-950/40 dark:bg-zinc-900/80">
      {/* Left: hamburger + breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 cursor-pointer text-orange-700 hover:bg-orange-100 dark:text-orange-400 dark:hover:bg-orange-950/30"
          onClick={onMenuToggle}
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-orange-500 dark:text-orange-700"
        >
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.href + idx}>
                {idx > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-orange-300 dark:text-orange-800" aria-hidden="true" />
                )}
                {isLast ? (
                  <span className="font-semibold text-orange-900 dark:text-orange-200 truncate max-w-[180px]">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="flex items-center gap-1 hover:text-orange-700 dark:hover:text-orange-300 transition-colors duration-150"
                  >
                    {crumb.name === 'Home' ? (
                      <Home className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      crumb.name
                    )}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: theme switcher */}
      <div className="flex items-center gap-3">
        <ThemeSwitcher />
      </div>
    </header>
  );
}
