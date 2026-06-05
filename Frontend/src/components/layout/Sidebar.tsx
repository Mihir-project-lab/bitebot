'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ChefHat, MessageSquare,
  Sparkles, UtensilsCrossed, LogOut, X, Flame,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const menuGroups = [
  {
    group: 'Kitchen',
    items: [
      { name: 'Dashboard',         href: '/dashboard',   icon: LayoutDashboard },
    ],
  },
  {
    group: 'Recipes',
    items: [
      { name: 'My Recipes',        href: '/recipes/my',  icon: ChefHat },
    ],
  },
  {
    group: 'AI Suite',
    items: [
      { name: 'Chat Assistant',     href: '/ai/chat',     icon: MessageSquare },
      { name: 'Recipe Generator',   href: '/ai/generate', icon: Sparkles },
      { name: 'Ingredient Matcher', href: '/ai/suggest',  icon: UtensilsCrossed },
    ],
  },
];

export function Sidebar({ isOpen = false, onClose, className }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLinkClick = () => { if (onClose) onClose(); };
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col',
          /* Light mode: warm cream white. Dark mode: soft dark gray (not black) */
          'bg-orange-50 border-r border-orange-200',
          'dark:bg-zinc-800 dark:border-zinc-700',
          'transition-transform duration-300 ease-in-out',
          'lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0 shadow-xl shadow-orange-900/10 dark:shadow-black/40' : '-translate-x-full',
          className,
        )}
      >
        {/* ── Logo ─────────────────────────────── */}
        <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-orange-200 dark:border-zinc-700">
          <Link
            href="/dashboard"
            onClick={handleLinkClick}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 shadow-md shadow-orange-400/30">
              <Flame className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span
              className="text-lg font-bold tracking-wide text-orange-800 group-hover:text-orange-600 dark:text-orange-200 dark:group-hover:text-orange-100 transition-colors duration-150"
              style={{ fontFamily: "'Playfair Display SC', Georgia, serif" }}
            >
              BiteBot
            </span>
          </Link>

          {onClose && (
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={onClose}
              className="lg:hidden flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-orange-400 hover:bg-orange-100 hover:text-orange-600 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 transition-colors duration-150"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* ── Navigation ───────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-5">
          {menuGroups.map((group) => (
            <div key={group.group}>
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-orange-400 dark:text-zinc-500">
                {group.group}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                          isActive
                            /* Light active: soft orange bg + orange text */
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'
                            /* Light inactive: muted stone, hover warm */
                            : 'text-stone-500 hover:bg-orange-100/70 hover:text-orange-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100',
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors duration-150',
                            isActive
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-orange-300 dark:text-zinc-500',
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>
                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500 dark:bg-orange-400" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* ── User footer ──────────────────────── */}
        <div className="shrink-0 border-t border-orange-200 dark:border-zinc-700 p-4 space-y-3">
          {user && (
            <div className="flex items-center gap-3 px-1">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-sm font-bold text-white shadow-sm">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-stone-800 dark:text-zinc-100">{user.name}</p>
                <p className="truncate text-xs text-stone-400 dark:text-zinc-500">{user.email}</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={logout}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-stone-500 dark:text-zinc-400 transition-all duration-150 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:border-red-900/40 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
