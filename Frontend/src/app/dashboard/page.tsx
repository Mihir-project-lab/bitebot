'use client';

import React from 'react';
import Link from 'next/link';
import {
  ChefHat, Sparkles, MessageSquare, Plus,
  ArrowRight, Flame, TrendingUp,
} from 'lucide-react';
import { useMyRecipes } from '@/hooks/useRecipes';
import { useAuthStore } from '@/store/authStore';
import { PageContainer } from '@/components/common/PageContainer';
import { Button } from '@/components/ui/Button';

/* ── Stat card ─────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  isLoading,
  href,
  linkLabel,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  isLoading: boolean;
  href: string;
  linkLabel: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md hover:shadow-orange-500/5 dark:border-zinc-700/50 dark:bg-zinc-800/40">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-medium text-stone-550 dark:text-zinc-400">{label}</p>
          <p className="text-2xl font-extrabold text-stone-900 dark:text-zinc-50">
            {isLoading ? (
              <span className="inline-block h-6 w-10 animate-pulse rounded bg-orange-100 dark:bg-zinc-700/50" />
            ) : (
              value
            )}
          </p>
        </div>
      </div>
      <div className="mt-4 border-t border-orange-100/60 pt-3 dark:border-zinc-700/40">
        <Link
          href={href}
          className="flex items-center justify-between text-xs font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors duration-150"
        >
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

/* ── Quick action card ─────────────────────────────────── */
function ActionCard({
  icon: Icon,
  title,
  description,
  href,
  accent,
  accentHover,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  accent: string;
  accentHover: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-2xl border border-orange-100 bg-white/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-950/5 dark:border-zinc-700/50 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/70 dark:hover:border-zinc-650/80 cursor-pointer"
    >
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${accent} ${accentHover}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <h3 className="text-base font-bold text-stone-900 group-hover:text-orange-700 dark:text-zinc-100 dark:group-hover:text-orange-400 transition-colors duration-150">
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-stone-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-sm font-semibold text-orange-600 dark:text-orange-400 group-hover:gap-2.5 transition-all duration-150">
        Let&apos;s go
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: myData, isLoading: isMyLoading } = useMyRecipes();

  const totalMy = myData?.length ?? 0;

  return (
    <PageContainer>
      {/* Background glow decoration for dark mode */}
      <div className="pointer-events-none absolute right-10 top-10 h-72 w-72 rounded-full bg-orange-400/5 blur-3xl dark:bg-orange-500/5" aria-hidden="true" />

      {/* ── Page header ──────────────────────────────── */}
      <div className="mb-10 flex flex-col gap-4 border-b border-orange-100 pb-6 dark:border-zinc-700/50 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-500 dark:text-orange-400">
            Your Kitchen
          </p>
          <h1
            className="text-3xl font-extrabold text-stone-900 dark:text-zinc-50 sm:text-4xl"
            style={{ fontFamily: "'Playfair Display SC', Georgia, serif" }}
          >
            Welcome back, Chef{user?.name ? ` ${user.name}` : ''}!
          </h1>
          <p className="mt-2 text-sm text-stone-550 dark:text-zinc-450">
            Ready to cook something amazing? Here&apos;s your culinary overview.
          </p>
        </div>
        <Link href="/recipes/create">
          <Button className="gap-2 bg-orange-600 text-white hover:bg-orange-700 shadow-sm shadow-orange-500/20 cursor-pointer shrink-0">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Recipe
          </Button>
        </Link>
      </div>

      {/* ── Stats row ────────────────────────────────── */}
      <div className="mb-10 grid gap-5 sm:grid-cols-2">
        <StatCard
          icon={ChefHat}
          label="My Recipes"
          value={totalMy}
          isLoading={isMyLoading}
          href="/recipes/my"
          linkLabel="Manage my creations"
          accent="bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
        />
        <StatCard
          icon={TrendingUp}
          label="AI Suite Status"
          value="Active"
          isLoading={false}
          href="/ai/chat"
          linkLabel="Access assistant"
          accent="bg-orange-100 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400"
        />
      </div>

      {/* ── Quick actions ─────────────────────────────── */}
      <div className="mb-6 flex items-center gap-3">
        <Flame className="h-5 w-5 text-orange-500" aria-hidden="true" />
        <h2 className="text-lg font-bold text-stone-900 dark:text-zinc-150">
          Quick Cooking Actions
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <ActionCard
          icon={Plus}
          title="Create Recipe"
          description="Manually add a recipe with ingredients, steps, and cooking times."
          href="/recipes/create"
          accent="bg-orange-100 text-orange-755 dark:bg-orange-950/20 dark:text-orange-400"
          accentHover="group-hover:bg-orange-200 dark:group-hover:bg-orange-950/40"
        />
        <ActionCard
          icon={Sparkles}
          title="Generate with AI"
          description="Describe a dish and let the AI build a complete recipe instantly."
          href="/ai/generate"
          accent="bg-violet-100 text-violet-755 dark:bg-violet-950/20 dark:text-violet-400"
          accentHover="group-hover:bg-violet-200 dark:group-hover:bg-violet-950/40"
        />
        <ActionCard
          icon={MessageSquare}
          title="Chat Assistant"
          description="Ask for cooking tips, ingredient swaps, timers, or food science."
          href="/ai/chat"
          accent="bg-rose-100 text-rose-755 dark:bg-rose-950/20 dark:text-rose-400"
          accentHover="group-hover:bg-rose-200 dark:group-hover:bg-rose-950/40"
        />
      </div>
    </PageContainer>
  );
}
