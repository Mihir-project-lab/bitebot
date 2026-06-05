'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ChefHat, Sparkles, MessageSquare, UtensilsCrossed,
  ArrowRight, Flame, Compass, Star, Clock, Users,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';

/* ── Floating ingredient chip ───────────────────────────── */
function IngredientChip({ label, delay }: { label: string; delay: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-semibold text-orange-800 shadow-sm backdrop-blur-sm dark:border-orange-900/40 dark:bg-stone-900/70 dark:text-orange-300"
      style={{ animationDelay: delay }}
    >
      {label}
    </span>
  );
}

/* ── Feature card ───────────────────────────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  description,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-orange-900/8 hover:-translate-y-1 dark:border-orange-950/40 dark:bg-stone-900">
      {/* Faint glow on hover */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${accent} blur-2xl -z-10 scale-90`} />
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${accent} shadow-sm`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-base font-bold text-stone-900 dark:text-orange-100">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-stone-500 dark:text-stone-400">{description}</p>
      </div>
    </div>
  );
}

/* ── Stat pill ──────────────────────────────────────────── */
function StatPill({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-orange-100 bg-white/70 px-6 py-4 backdrop-blur-sm dark:border-orange-950/30 dark:bg-stone-900/60">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/40">
        <Icon className="h-4.5 w-4.5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
      </div>
      <span className="text-2xl font-extrabold text-stone-900 dark:text-orange-100">{value}</span>
      <span className="text-xs font-medium text-stone-500 dark:text-stone-400">{label}</span>
    </div>
  );
}

export default function LandingPage() {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  const features = [
    {
      icon: Sparkles,
      title: 'AI Recipe Builder',
      description: 'Describe any dish, dietary goal, or flavour profile and BiteBot crafts a complete recipe in seconds.',
      accent: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    },
    {
      icon: UtensilsCrossed,
      title: 'Pantry Matcher',
      description: 'Tell us what\'s in your fridge and we\'ll suggest the most delicious dishes you can cook right now.',
      accent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    },
    {
      icon: MessageSquare,
      title: 'Cooking Companion',
      description: 'Chat in real-time with your AI chef for substitution tips, scaling help, and step-by-step guidance.',
      accent: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
    },
    {
      icon: ChefHat,
      title: 'Recipe Manager',
      description: 'Organise your growing personal cookbook in a beautiful grid. Create, edit, and share your creations.',
      accent: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
    },
  ];

  const steps = [
    { n: '1', title: 'Describe your dish', body: 'Type a few words about what you want to cook — ingredients, cuisine, dietary needs.' },
    { n: '2', title: 'AI crafts the recipe', body: 'BiteBot generates a complete recipe with ingredients, steps, and cooking times instantly.' },
    { n: '3', title: 'Cook & enjoy', body: 'Follow the interactive guide, ask questions, and serve something memorable every time.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/60 text-stone-900 dark:bg-zinc-800 dark:text-orange-50 transition-colors duration-300">

      {/* ── Navbar ───────────────────────────────────────── */}
      <header className="sticky top-0 z-30 w-full border-b border-orange-100 bg-orange-50/80 backdrop-blur-md dark:border-orange-950/30 dark:bg-zinc-800/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="BiteBot home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30">
              <Flame className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span
              className="text-xl font-bold text-orange-900 dark:text-orange-100"
              style={{ fontFamily: "'Playfair Display SC', Georgia, serif" }}
            >
              BiteBot
            </span>
          </Link>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            {mounted && !isLoading && isAuthenticated ? (
              <Link href="/dashboard">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-orange-600 text-white hover:bg-orange-700 shadow-sm shadow-orange-500/20 cursor-pointer"
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block text-sm font-semibold text-stone-600 hover:text-orange-700 dark:text-stone-400 dark:hover:text-orange-400 transition-colors duration-150"
                >
                  Sign In
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-orange-600 text-white hover:bg-orange-700 shadow-sm shadow-orange-500/20 cursor-pointer"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/20 blur-[100px] dark:bg-orange-600/10" />
          <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-amber-400/20 blur-[90px] dark:bg-amber-700/10" />
          <div className="absolute left-2/3 top-0 h-[300px] w-[300px] rounded-full bg-red-400/15 blur-[80px] dark:bg-red-700/8" />
        </div>

        {/* Badge */}
        <div className="relative z-10 mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/80 px-4 py-1.5 backdrop-blur-sm dark:border-orange-900/40 dark:bg-orange-950/30">
          <Flame className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400">
            AI-Powered Cooking Assistant
          </span>
        </div>

        {/* Headline */}
        <h1
          className="relative z-10 max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-stone-900 dark:text-orange-50 sm:text-6xl lg:text-7xl"
          style={{ fontFamily: "'Playfair Display SC', Georgia, serif" }}
        >
          Cook Like a{' '}
          <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 bg-clip-text text-transparent">
            Chef
          </span>
          {' '}Every Night
        </h1>

        {/* Sub */}
        <p className="relative z-10 mt-6 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-400">
          Craft custom recipes, discover dishes from your pantry, and get live coaching from your personal AI kitchen companion.
        </p>

        {/* CTA */}
        <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-4">
          {mounted && !isLoading && isAuthenticated ? (
            <Link href="/dashboard">
              <Button
                size="lg"
                className="gap-2 bg-orange-600 text-white hover:bg-orange-700 shadow-xl shadow-orange-500/25 cursor-pointer"
              >
                Go to Dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <Button
                  size="lg"
                  className="gap-2 bg-orange-600 text-white hover:bg-orange-700 shadow-xl shadow-orange-500/25 cursor-pointer"
                >
                  Start Cooking Free <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/recipes/my">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-orange-200 bg-white text-stone-700 hover:bg-orange-50 hover:border-orange-300 dark:border-orange-900/40 dark:bg-stone-900 dark:text-orange-200 dark:hover:bg-orange-950/30 cursor-pointer"
                >
                  <Compass className="h-4 w-4 text-orange-500" aria-hidden="true" />
                  My Recipes
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Floating ingredient chips */}
        <div className="relative z-10 mt-12 flex flex-wrap items-center justify-center gap-2.5">
          {['🧅 Garlic', '🍅 Tomatoes', '🌿 Basil', '🧀 Parmesan', '🍋 Lemon', '🧈 Butter'].map((ing, i) => (
            <IngredientChip key={ing} label={ing} delay={`${i * 80}ms`} />
          ))}
        </div>

        {/* Stats row */}
        <div className="relative z-10 mt-14 grid grid-cols-3 gap-4 sm:gap-6">
          <StatPill icon={ChefHat} value="500+" label="Recipes" />
          <StatPill icon={Star}    value="4.9★" label="Rating" />
          <StatPill icon={Users}   value="10k+" label="Cooks" />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="border-t border-orange-100 bg-white py-24 dark:border-orange-950/30 dark:bg-stone-900/50">
        <div className="mx-auto max-w-7xl px-6">
          {/* Section title */}
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange-500 dark:text-orange-400">
              Your Complete Suite
            </p>
            <h2
              className="text-3xl font-extrabold text-stone-900 dark:text-orange-50 sm:text-4xl"
              style={{ fontFamily: "'Playfair Display SC', Georgia, serif" }}
            >
              Everything in One Kitchen
            </h2>
            <p className="mt-4 text-stone-500 dark:text-stone-400">
              BiteBot combines powerful AI tools with a personal recipe vault to make every meal an adventure.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="border-t border-orange-100 bg-orange-50/80 py-24 dark:border-orange-950/30 dark:bg-zinc-800">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange-500">How It Works</p>
            <h2
              className="text-3xl font-extrabold text-stone-900 dark:text-orange-50 sm:text-4xl"
              style={{ fontFamily: "'Playfair Display SC', Georgia, serif" }}
            >
              From Idea to Plate in 3 Steps
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.n} className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+2rem)] top-7 hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-orange-300 to-transparent dark:from-orange-800/50 sm:block" aria-hidden="true" />
                )}
                {/* Step circle */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-xl font-extrabold text-white shadow-lg shadow-orange-500/30">
                  {step.n}
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-orange-100">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500 dark:text-stone-400">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="border-t border-orange-100 dark:border-orange-950/30">
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-100/60 via-red-50/40 to-amber-100/60 dark:from-zinc-900 dark:via-orange-950/20 dark:to-zinc-900 py-20 text-center">
          {/* Background circles */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          </div>

          <div className="relative mx-auto max-w-2xl px-6">
            <div className="mb-4 flex justify-center">
              <Clock className="h-10 w-10 text-orange-500/80 dark:text-orange-400/80" aria-hidden="true" />
            </div>
            <h2
              className="text-3xl font-extrabold text-stone-900 dark:text-orange-100 sm:text-4xl"
              style={{ fontFamily: "'Playfair Display SC', Georgia, serif" }}
            >
              Ready to Cook Something Incredible?
            </h2>
            <p className="mt-4 text-lg text-stone-550 dark:text-zinc-400">
              Join thousands of home cooks who have already discovered the joy of AI-powered cooking.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="gap-2 bg-orange-600 text-white hover:bg-orange-700 shadow-md cursor-pointer font-bold dark:bg-orange-600 dark:text-white dark:hover:bg-orange-700"
                >
                  Start Cooking Free <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-orange-200 text-orange-755 hover:bg-orange-50/80 cursor-pointer dark:border-orange-900/40 dark:text-orange-450 dark:hover:bg-orange-950/30"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-orange-100 bg-white py-10 dark:border-orange-950/30 dark:bg-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
              <Flame className="h-3.5 w-3.5 text-white" aria-hidden="true" />
            </div>
            <span
              className="font-bold text-stone-700 dark:text-stone-300"
              style={{ fontFamily: "'Playfair Display SC', Georgia, serif" }}
            >
              BiteBot
            </span>
            <span className="text-xs text-stone-400 dark:text-stone-600">
              © {new Date().getFullYear()}
            </span>
          </div>
          <nav className="flex gap-6 text-sm text-stone-500 dark:text-stone-500" aria-label="Footer navigation">
            <Link href="/recipes/my" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-150">My Recipes</Link>
            <Link href="/login"   className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-150">Sign In</Link>
            <Link href="/register" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-150">Sign Up</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
