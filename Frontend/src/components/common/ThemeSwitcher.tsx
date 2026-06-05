'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'bitebot-theme';

function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  root.classList.toggle('dark', isDark);
  root.setAttribute('data-theme', theme);
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /* Read storage only after mount — prevents hydration mismatch */
  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
    setTheme(stored);
    setMounted(true);
  }, []);

  const handleThemeChange = useCallback((next: Theme) => {
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyThemeToDOM(next);
    setIsOpen(false);
  }, []);

  /* Follow system preference while in "system" mode */
  useEffect(() => {
    if (!mounted || theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyThemeToDOM('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mounted, theme]);

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element).closest('[data-theme-switcher]')) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const options: { value: Theme; label: string; Icon: React.ElementType }[] = [
    { value: 'light',  label: 'Light',  Icon: Sun },
    { value: 'dark',   label: 'Dark',   Icon: Moon },
    { value: 'system', label: 'System', Icon: Monitor },
  ];

  const current = options.find((o) => o.value === theme) ?? options[2];
  const CurrentIcon = current.Icon;

  /* Stable placeholder before hydration */
  if (!mounted) {
    return <div className="h-9 w-9 rounded-lg bg-orange-100 dark:bg-orange-950/20" />;
  }

  return (
    <div className="relative" data-theme-switcher>
      {/* Trigger */}
      <button
        type="button"
        id="theme-switcher-btn"
        aria-label="Toggle color theme"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition-all duration-200',
          'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:border-orange-300 hover:shadow-sm',
          'dark:border-orange-900/40 dark:bg-orange-950/20 dark:text-orange-400 dark:hover:bg-orange-950/40 dark:hover:border-orange-800/50',
          isOpen && 'ring-2 ring-orange-400/40 dark:ring-orange-600/30'
        )}
      >
        <CurrentIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[9999] mt-2 min-w-[148px] overflow-hidden rounded-xl border border-orange-200 bg-white shadow-xl shadow-orange-900/10 dark:border-orange-900/30 dark:bg-stone-900 dark:shadow-black/40 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="p-1.5 space-y-0.5">
            {options.map(({ value, label, Icon }) => {
              const active = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="menuitem"
                  onClick={() => handleThemeChange(value)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                    active
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400'
                      : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-white/5'
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {label}
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-500 dark:bg-orange-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
