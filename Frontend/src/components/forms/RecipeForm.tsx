'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { FormSelect } from './FormSelect';
import { FormMultiInput } from './FormMultiInput';
import { Button } from '../ui/Button';

// 1. Zod validation schema for Recipes
const recipeSchema = zod.object({
  title: zod.string().min(3, 'Title must be at least 3 characters'),
  description: zod.string().min(10, 'Description must be at least 10 characters'),
  cuisine: zod.string().min(2, 'Cuisine category is required (e.g. Italian, Indian)'),
  difficulty: zod.enum(['easy', 'medium', 'hard'], {
    message: 'Please select difficulty level',
  }),
  cookTimeMinutes: zod.number().min(1, 'Cook time must be at least 1 minute'),
  servings: zod.number().min(1, 'Servings must be at least 1 person'),
  tagsInput: zod.string().optional(),
  ingredients: zod
    .array(
      zod.object({
        name: zod.string().min(1, 'Ingredient name is required'),
        amount: zod.string().min(1, 'Amount is required (e.g. 2 tsp, 200g)'),
      })
    )
    .min(1, { message: 'Must include at least 1 ingredient' }),
  steps: zod
    .array(zod.string().min(1, 'Step description cannot be empty'))
    .min(1, { message: 'Must include at least 1 instruction step' }),
});

export type RecipeFormFields = zod.infer<typeof recipeSchema>;

interface RecipeFormProps {
  initialValues?: Partial<RecipeFormFields>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  submitLabel?: string;
  cancelHref: string;
}

export function RecipeForm({
  initialValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save Recipe',
  cancelHref,
}: RecipeFormProps) {
  const methods = useForm<RecipeFormFields>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      cuisine: initialValues?.cuisine || '',
      difficulty: initialValues?.difficulty || 'medium',
      cookTimeMinutes: initialValues?.cookTimeMinutes || 30,
      servings: initialValues?.servings || 4,
      tagsInput: initialValues?.tagsInput || '',
      ingredients: initialValues?.ingredients || [{ name: '', amount: '' }],
      steps: initialValues?.steps || [''],
    },
  });

  const handleSubmitInternal = (data: RecipeFormFields) => {
    // Split comma-separated tags into an array of clean string segments
    const tags = data.tagsInput
      ? data.tagsInput
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    const { tagsInput, ...payload } = data;
    onSubmit({ ...payload, tags });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmitInternal)}
        className="space-y-8 max-w-2xl bg-white border border-zinc-205 rounded-2xl p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-950 shadow-sm"
      >
        <div className="space-y-6">
          <FormInput
            name="title"
            label="Recipe Title"
            placeholder="e.g. Creamy Tuscan Garlic Chicken"
            disabled={isLoading}
          />

          <FormTextarea
            name="description"
            label="Short Description"
            placeholder="Introduce the recipe, tell us what makes it special..."
            rows={3}
            disabled={isLoading}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              name="cuisine"
              label="Cuisine"
              placeholder="e.g. Italian, Mexican, Fusion"
              disabled={isLoading}
            />

            <FormSelect
              name="difficulty"
              label="Difficulty Level"
              placeholder="Select difficulty"
              options={[
                { value: 'easy', label: 'Easy' },
                { value: 'medium', label: 'Medium' },
                { value: 'hard', label: 'Hard' },
              ]}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              name="cookTimeMinutes"
              label="Cook Time (Minutes)"
              type="number"
              min={1}
              disabled={isLoading}
            />

            <FormInput
              name="servings"
              label="Servings (People)"
              type="number"
              min={1}
              disabled={isLoading}
            />
          </div>

          <FormInput
            name="tagsInput"
            label="Tags (Comma separated)"
            placeholder="e.g. chicken, keto, quick, dinner"
            helperText="Separate each tag with a comma"
            disabled={isLoading}
          />

          {/* Dynamic list arrays */}
          <div className="space-y-6 pt-4 border-t border-zinc-150 dark:border-zinc-800">
            <FormMultiInput
              name="ingredients"
              type="ingredients"
              label="Ingredients List"
              addButtonText="Add Ingredient"
            />
          </div>

          <div className="space-y-6 pt-4 border-t border-zinc-150 dark:border-zinc-800">
            <FormMultiInput
              name="steps"
              type="steps"
              label="Cooking Steps"
              addButtonText="Add Step"
            />
          </div>
        </div>

        {/* Form controls buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-150 dark:border-zinc-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.href = cancelHref}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
