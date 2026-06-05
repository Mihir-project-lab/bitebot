'use client';

import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ChefHat, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRecipes } from '@/hooks/useRecipes';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RecipesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Queries the backend for recipes (cache synchronized by React Query)
  const { data, isLoading, isError, refetch } = useRecipes(search, page);

  const recipes = data?.recipes || [];
  const totalPages = data?.pages || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on new filter
  };

  return (
    <PageContainer>
      <PageHeader
        title="Browse Recipes"
        description="Search through a wide variety of public recipes and find inspiration."
        action={
          <Link href="/recipes/create">
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Recipe
            </Button>
          </Link>
        }
      />

      {/* Filters bar */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-450 dark:text-zinc-550" />
        <Input
          placeholder="Search recipes, cuisines, tags..."
          value={search}
          onChange={handleSearchChange}
          className="pl-9"
        />
      </div>

      {/* Results grid */}
      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="rounded-xl border border-zinc-200 p-5 bg-white space-y-4 dark:border-zinc-805 dark:bg-zinc-950">
              <LoadingSkeleton className="h-4 w-24" />
              <LoadingSkeleton className="h-6 w-full" />
              <LoadingSkeleton className="h-12 w-full" />
              <LoadingSkeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <EmptyState
          title="No recipes found"
          description={
            search
              ? `We couldn't find any recipes matching "${search}". Try adjusting filters.`
              : "The recipe catalog is empty. Be the first to share a culinary creation!"
          }
          icon={ChefHat}
          action={
            search
              ? { label: 'Clear search filter', onClick: () => setSearch('') }
              : undefined
          }
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-zinc-150 pt-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Page <span className="font-semibold">{page}</span> of{' '}
                <span className="font-semibold">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
