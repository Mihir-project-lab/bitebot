import React from 'react';
import Link from 'next/link';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Recipe } from '@/types';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

interface RecipeTableProps {
  recipes: Recipe[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

export function RecipeTable({ recipes, onEdit, onDelete }: RecipeTableProps) {
  const getDifficultyBadge = (difficulty: 'easy' | 'medium' | 'hard') => {
    const badgeColors = {
      easy: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30',
      medium: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30',
      hard: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30',
    }[difficulty] || 'bg-zinc-50 text-zinc-750';

    return (
      <span className={cn('rounded-full border px-2 py-0.5 text-xs font-semibold', badgeColors)}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Cuisine</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Cook Time</th>
              <th className="px-6 py-4">Servings</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800 text-sm text-zinc-700 dark:text-zinc-300">
            {recipes.map((recipe) => (
              <tr
                key={recipe.id}
                className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/recipes/${recipe.id}`}
                      className="font-semibold text-zinc-900 hover:text-indigo-600 dark:text-zinc-50 dark:hover:text-indigo-400 flex items-center gap-1 group"
                    >
                      {recipe.title}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{recipe.cuisine}</td>
                <td className="px-6 py-4">{getDifficultyBadge(recipe.difficulty)}</td>
                <td className="px-6 py-4">{recipe.cookTimeMinutes} mins</td>
                <td className="px-6 py-4">{recipe.servings} people</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-indigo-650 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
                      onClick={() => onEdit(recipe)}
                      title="Edit Recipe"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={() => onDelete(recipe)}
                      title="Delete Recipe"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
