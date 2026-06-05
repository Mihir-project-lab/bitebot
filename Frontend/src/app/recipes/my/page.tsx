'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutGrid, Table, Plus, ChefHat } from 'lucide-react';
import Link from 'next/link';
import { useMyRecipes, useDeleteRecipe } from '@/hooks/useRecipes';
import { Recipe } from '@/types';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { RecipeTable } from '@/components/recipes/RecipeTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/ui/Button';

export default function MyRecipesPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  // Queries & Mutations
  const { data: recipes = [], isLoading, isError, refetch } = useMyRecipes();
  const { mutate: deleteRecipe, isPending: isDeletePending } = useDeleteRecipe();

  const handleEdit = (recipe: Recipe) => {
    router.push(`/recipes/${recipe.id}/edit`);
  };

  const handleDeleteTrigger = (recipe: Recipe) => {
    setRecipeToDelete(recipe);
  };

  const handleDeleteConfirm = () => {
    if (recipeToDelete) {
      deleteRecipe(recipeToDelete.id, {
        onSuccess: () => {
          setRecipeToDelete(null);
        },
      });
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="My Recipes"
        description="Manage, edit, or delete the recipes you have shared on BiteBot."
        action={
          <div className="flex gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${viewMode === 'grid' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50' : 'text-zinc-500'}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${viewMode === 'table' ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50' : 'text-zinc-500'}`}
                onClick={() => setViewMode('table')}
              >
                <Table className="h-4 w-4" />
              </Button>
            </div>

            <Link href="/recipes/create">
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                New Recipe
              </Button>
            </Link>
          </div>
        }
      />

      {/* Main content display */}
      {isError ? (
        <ErrorState onRetry={refetch} />
      ) : isLoading ? (
        <div className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="rounded-xl border border-zinc-200 p-5 bg-white space-y-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <LoadingSkeleton className="h-4 w-24" />
                  <LoadingSkeleton className="h-6 w-full" />
                  <LoadingSkeleton className="h-12 w-full" />
                  <LoadingSkeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <LoadingSkeleton className="h-10 w-full" />
              <LoadingSkeleton className="h-12 w-full" />
              <LoadingSkeleton className="h-12 w-full" />
            </div>
          )}
        </div>
      ) : recipes.length === 0 ? (
        <EmptyState
          title="You haven't created any recipes yet"
          description="Click the button below to write your first recipe, or generate one using AI."
          icon={ChefHat}
          action={{
            label: 'Create first recipe',
            onClick: () => router.push('/recipes/create'),
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isMyRecipe={true}
              onEdit={() => handleEdit(recipe)}
              onDelete={() => handleDeleteTrigger(recipe)}
            />
          ))}
        </div>
      ) : (
        <RecipeTable
          recipes={recipes}
          onEdit={handleEdit}
          onDelete={handleDeleteTrigger}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={recipeToDelete !== null}
        onOpenChange={(isOpen) => !isOpen && setRecipeToDelete(null)}
        title="Delete Recipe"
        description={`Are you sure you want to delete "${recipeToDelete?.title || 'this recipe'}"? This action cannot be undone.`}
        cancelText="Keep Recipe"
        confirmText="Delete permanently"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeletePending}
        variant="destructive"
      />
    </PageContainer>
  );
}
