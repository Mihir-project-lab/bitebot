"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useRecipe, useUpdateRecipe } from "@/hooks/useRecipes";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { RecipeForm } from "@/components/forms/RecipeForm";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: recipe, isLoading, isError, refetch } = useRecipe(id);
  const { mutate: updateRecipe, isPending: isUpdating } = useUpdateRecipe(id);

  const handleSubmit = (payload: any) => {
    updateRecipe(payload, {
      onSuccess: () => {
        router.push("/recipes/my");
      },
    });
  };

  if (isError) {
    return (
      <PageContainer size="narrow">
        <ErrorState
          title="Failed to fetch recipe details"
          description="We couldn't retrieve the recipe for editing. Please try again."
          onRetry={refetch}
        />
      </PageContainer>
    );
  }

  if (isLoading || !recipe) {
    return (
      <PageContainer size="narrow">
        <div className="space-y-6">
          <LoadingSkeleton className="h-10 w-24" />
          <LoadingSkeleton className="h-12 w-full" />
          <LoadingSkeleton className="h-[400px] w-full" />
        </div>
      </PageContainer>
    );
  }

  // Pre-format tags into a clean comma-separated string
  const formInitialValues = {
    title: recipe.title,
    description: recipe.description,
    cuisine: recipe.cuisine,
    difficulty: recipe.difficulty,
    cookTimeMinutes: recipe.cookTimeMinutes,
    servings: recipe.servings,
    tagsInput: recipe.tags ? recipe.tags.join(", ") : "",
    ingredients: recipe.ingredients,
    steps: recipe.steps,
  };

  return (
    <PageContainer size="narrow">
      <PageHeader
        title="Edit Recipe"
        description={`Modify the details, ingredients or steps of "${recipe.title}".`}
      />
      <RecipeForm
        initialValues={formInitialValues}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
        submitLabel="Update Recipe"
        cancelHref="/recipes/my"
      />
    </PageContainer>
  );
}
