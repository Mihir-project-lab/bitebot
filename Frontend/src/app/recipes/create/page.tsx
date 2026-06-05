'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCreateRecipe } from '@/hooks/useRecipes';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { RecipeForm } from '@/components/forms/RecipeForm';

export default function CreateRecipePage() {
  const router = useRouter();
  const { mutate: createRecipe, isPending } = useCreateRecipe();

  const handleSubmit = (payload: any) => {
    createRecipe(payload, {
      onSuccess: () => {
        router.push('/recipes/my');
      },
    });
  };

  return (
    <PageContainer size="narrow">
      <PageHeader
        title="Create Recipe"
        description="Share a new recipe with the community. Fill in ingredients and cooking details."
      />
      <RecipeForm
        onSubmit={handleSubmit}
        isLoading={isPending}
        submitLabel="Create Recipe"
        cancelHref="/recipes/my"
      />
    </PageContainer>
  );
}
