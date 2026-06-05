'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Users, Flame, BookOpen, User, Tag } from 'lucide-react';
import { useRecipe } from '@/hooks/useRecipes';
import { PageContainer } from '@/components/common/PageContainer';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { cn } from '@/lib/utils';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: recipe, isLoading, isError, refetch } = useRecipe(id);

  const handleBack = () => {
    router.back();
  };

  if (isError) {
    return (
      <PageContainer>
        <div className="py-10">
          <ErrorState
            title="Failed to load recipe"
            description="The recipe you requested could not be retrieved, or does not exist."
            onRetry={refetch}
          />
        </div>
      </PageContainer>
    );
  }

  if (isLoading || !recipe) {
    return (
      <PageContainer size="narrow">
        <div className="space-y-6">
          <LoadingSkeleton className="h-10 w-24" />
          <LoadingSkeleton className="h-12 w-3/4" />
          <LoadingSkeleton className="h-6 w-1/2" />
          <div className="grid grid-cols-2 gap-4">
            <LoadingSkeleton className="h-20" />
            <LoadingSkeleton className="h-20" />
          </div>
          <div className="space-y-3">
            <LoadingSkeleton className="h-6 w-1/4" />
            <LoadingSkeleton className="h-10 w-full" />
            <LoadingSkeleton className="h-10 w-full" />
          </div>
        </div>
      </PageContainer>
    );
  }

  const difficultyColors = {
    easy: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
    medium: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
    hard: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
  }[recipe.difficulty] || 'bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';

  return (
    <PageContainer size="narrow" className="py-8">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute right-1/4 top-20 h-96 w-96 rounded-full bg-orange-400/5 blur-3xl dark:bg-orange-500/5" aria-hidden="true" />

      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="mb-6 h-9 px-3 flex items-center gap-1.5 text-orange-700 hover:bg-orange-100/70 hover:text-orange-800 dark:text-orange-400 dark:hover:bg-zinc-850 dark:hover:text-orange-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Recipes
      </Button>

      {/* Recipe card wrapper */}
      <article className="rounded-2xl border border-orange-100/80 bg-white/70 shadow-md shadow-orange-950/5 backdrop-blur-md overflow-hidden dark:border-zinc-700/50 dark:bg-zinc-800/40">
        <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-red-500 to-amber-500" />
        
        <div className="p-6 sm:p-8">
          {/* Header Section */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-orange-100/60 pb-6 dark:border-zinc-750">
            <div>
              <span className="inline-flex items-center rounded-md bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-850 dark:bg-orange-950/40 dark:text-orange-400 tracking-wide uppercase">
                {recipe.cuisine} Cuisine
              </span>
              <h1 
                className="mt-3 text-3xl font-extrabold text-stone-900 dark:text-zinc-50 sm:text-4xl"
                style={{ fontFamily: "'Playfair Display SC', Georgia, serif" }}
              >
                {recipe.title}
              </h1>
            </div>
            <span className={cn('rounded-full border px-3.5 py-1 text-xs font-bold shadow-sm', difficultyColors)}>
              {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
            </span>
          </div>

          {/* Description */}
          {recipe.description && (
            <p className="mt-6 text-base leading-relaxed text-stone-750 dark:text-zinc-200 italic bg-orange-50/30 p-4 rounded-xl border border-orange-100/30 dark:bg-zinc-900/80 dark:border-zinc-700/60">
              &ldquo;{recipe.description}&rdquo;
            </p>
          )}

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl bg-orange-50/30 p-5 border border-orange-100/40 dark:bg-zinc-900/30 dark:border-zinc-750/50 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-stone-500 dark:text-zinc-400">
                <Clock className="h-4.5 w-4.5 text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Cook Time</span>
              </div>
              <p className="text-xl font-extrabold text-stone-900 dark:text-zinc-100">{recipe.cookTimeMinutes} mins</p>
            </div>
            <div className="space-y-1 border-l border-orange-100/60 dark:border-zinc-750/50">
              <div className="flex items-center justify-center gap-1.5 text-stone-500 dark:text-zinc-400">
                <Users className="h-4.5 w-4.5 text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Servings</span>
              </div>
              <p className="text-xl font-extrabold text-stone-900 dark:text-zinc-100">{recipe.servings} servings</p>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="mt-10">
            <h2 className="text-lg font-extrabold text-stone-900 dark:text-zinc-100 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white shadow-md shadow-orange-400/20">1</span>
              Ingredients You&apos;ll Need
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {recipe.ingredients.map((ing, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-4 rounded-xl border border-orange-100/40 bg-white/50 px-4 py-3 text-sm transition-all hover:border-orange-200/60 dark:border-zinc-700/60 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/80 dark:hover:border-zinc-600/80 shadow-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span className="text-stone-755 dark:text-zinc-200 font-medium break-words leading-tight">
                      {ing.name}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-lg bg-orange-100/60 px-2.5 py-1 text-xs font-bold text-orange-850 dark:bg-orange-950/50 dark:text-orange-300 shadow-sm">
                    {ing.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps Section */}
          <div className="mt-10">
            <h2 className="text-lg font-extrabold text-stone-900 dark:text-zinc-100 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white shadow-md shadow-orange-400/20">2</span>
              Step-by-Step Instructions
            </h2>
            <ol className="mt-5 space-y-4">
              {recipe.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-4 rounded-xl border border-orange-100/30 p-5 bg-white/50 hover:border-orange-200/40 transition-colors dark:border-zinc-700/60 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/80 dark:hover:border-zinc-600/80 shadow-sm"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-xs font-bold text-white shadow-md shadow-orange-400/20">
                    {idx + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-stone-700 dark:text-zinc-200">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tags Section */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mt-10 border-t border-orange-150/40 pt-6 dark:border-zinc-750/50">
              <div className="flex flex-wrap gap-2 items-center">
                <Tag className="h-4 w-4 text-orange-450 dark:text-orange-400 mr-1" />
                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-orange-55/60 border border-orange-100 px-3 py-1 text-xs font-semibold text-orange-800 dark:bg-zinc-800/60 dark:border-zinc-700/60 dark:text-orange-300 transition-colors duration-150 hover:bg-orange-100/80 dark:hover:bg-zinc-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </PageContainer>
  );
}
