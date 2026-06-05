'use client';

import React, { useState } from 'react';
import { X, Plus, Sparkles, ChefHat } from 'lucide-react';
import { useAISuggest } from '@/hooks/useAI';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AiSuggestPage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Mutation hook
  const { mutate: getSuggestions, data: recipes = [], isPending, isError, reset } = useAISuggest();

  const handleAddIngredient = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients((prev) => [...prev, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredients((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSearch = () => {
    if (ingredients.length > 0) {
      getSuggestions(ingredients);
    }
  };

  const handleResetForm = () => {
    setIngredients([]);
    reset();
  };

  return (
    <PageContainer>
      <PageHeader
        title="AI Recipe Suggest"
        description="Enter the ingredients you have on hand, and BiteBot will suggest delicious recipes you can cook right now."
      />

      <div className="w-full bg-white border border-zinc-200 rounded-2xl p-6 dark:border-zinc-800 dark:bg-zinc-950 shadow-sm mb-8">
        <h3 className="text-sm font-semibold text-zinc-850 dark:text-zinc-200 mb-3">
          What is in your pantry/fridge?
        </h3>
        
        {/* Input box */}
        <div className="flex gap-2">
          <Input
            placeholder="Type ingredient (e.g. Tomato, Garlic, Chicken) and press Enter"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
          />
          <Button type="button" onClick={handleAddIngredient} variant="outline" disabled={isPending} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {/* Chips display */}
        <div className="mt-4 flex flex-wrap gap-2 min-h-[40px] items-center">
          {ingredients.length === 0 ? (
            <p className="text-xs text-zinc-400 dark:text-zinc-550 italic">
              No ingredients added yet. Add at least one to get suggestions.
            </p>
          ) : (
            ingredients.map((ing, idx) => (
              <span
                key={ing + idx}
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 pl-3 pr-1.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/30 dark:text-indigo-400 animate-in zoom-in duration-150"
              >
                {ing}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(idx)}
                  className="rounded-full p-0.5 hover:bg-indigo-150 text-indigo-550 hover:text-indigo-800 dark:hover:bg-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Action controls */}
        <div className="mt-6 flex justify-end gap-3 border-t border-zinc-150 pt-4 dark:border-zinc-850">
          {recipes.length > 0 && (
            <Button variant="ghost" onClick={handleResetForm} disabled={isPending} className="text-zinc-500 hover:text-zinc-800">
              Clear All
            </Button>
          )}
          <Button
            onClick={handleSearch}
            disabled={ingredients.length === 0 || isPending}
            isLoading={isPending}
            className="flex items-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            Get Recipe Suggestions
          </Button>
        </div>
      </div>

      {/* Suggested Recipes Results */}
      {isPending ? (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-500 animate-pulse">Consulting BiteBot Chef...</h3>
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
        </div>
      ) : recipes.length > 0 ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
            Suggested Recipes ({recipes.length})
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      ) : isError ? (
        <EmptyState
          title="AI suggestion error"
          description="Failed to fetch recipe suggestions. Make sure your internet is working or try adding different ingredients."
          icon={X}
        />
      ) : null}
    </PageContainer>
  );
}
