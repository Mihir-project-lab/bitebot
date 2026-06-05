import React from 'react';
import Link from 'next/link';
import { Clock, Users, Flame, BookOpen } from 'lucide-react';
import { Recipe } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface RecipeCardProps {
  recipe: Recipe | Partial<Recipe>;
  isMyRecipe?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function RecipeCard({ recipe, isMyRecipe = false, onEdit, onDelete }: RecipeCardProps) {
  const {
    id,
    title = 'Untitled Recipe',
    description = '',
    cuisine = 'General',
    difficulty = 'medium',
    cookTimeMinutes = 30,
    servings = 4,
    tags = [],
  } = recipe;

  const difficultyColors = {
    easy: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30',
    medium: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30',
    hard: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30',
  }[difficulty] || 'bg-zinc-50 text-zinc-700 border-zinc-150';

  const isSuggested = id?.toString().startsWith('suggested-');
  const showLink = !!id && !isSuggested;

  const cardContent = (
    <div className={cn("flex flex-col flex-1 p-5", showLink && "group-hover:opacity-95")}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 tracking-wide uppercase">
          {cuisine}
        </span>
        <span className={cn('rounded-full border px-2 py-0.5 text-xs font-semibold', difficultyColors)}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
        {title}
      </h3>

      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 min-h-[40px]">
        {description || 'Explore this delicious step-by-step recipe.'}
      </p>

      {/* Stats */}
      <div className="mt-4 flex flex-wrap gap-4 border-t border-zinc-100 pt-4 text-xs font-medium text-zinc-500 dark:border-zinc-900 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-zinc-400" />
          <span>{cookTimeMinutes} mins</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-zinc-400" />
          <span>{servings} servings</span>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-650 dark:bg-zinc-900 dark:text-zinc-400"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-[10px] font-medium text-zinc-400 self-center">
              +{tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      {/* Header accents / culinary warmth banner */}
      <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

      {showLink ? (
        <Link href={`/recipes/${id}`} className="flex flex-col flex-1 hover:no-underline">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}

      {/* Action footer */}
      <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 flex gap-2 dark:border-zinc-900 dark:bg-zinc-950/50">
        {isMyRecipe ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8"
              onClick={(e) => {
                e.preventDefault();
                if (onEdit) onEdit();
              }}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 h-8"
              onClick={(e) => {
                e.preventDefault();
                if (onDelete) onDelete();
              }}
            >
              Delete
            </Button>
          </>
        ) : id?.toString().startsWith('suggested-') ? (
          <Link href={`/ai/generate?prompt=${encodeURIComponent(title)}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full h-8 flex items-center justify-center gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:text-indigo-400 dark:border-indigo-900/50 dark:hover:bg-indigo-950/30">
              <Flame className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              Generate Recipe
            </Button>
          </Link>
        ) : (
          <Link href={`/recipes/${id}`} className="w-full">
            <Button variant="outline" size="sm" className="w-full h-8 flex items-center justify-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              View Recipe
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
