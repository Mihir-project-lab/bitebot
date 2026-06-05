import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recipeService } from "@/lib/api/recipe.service";
import { CreateRecipeDto, UpdateRecipeDto, Recipe } from "@/types";
import { toast } from "sonner";

// Keys for Query Caching
export const RECIPE_KEYS = {
  all: ["recipes"] as const,
  lists: () => [...RECIPE_KEYS.all, "list"] as const,
  list: (search?: string, page?: number) =>
    [...RECIPE_KEYS.lists(), { search, page }] as const,
  details: () => [...RECIPE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...RECIPE_KEYS.details(), id] as const,
  my: () => [...RECIPE_KEYS.all, "my"] as const,
};

// 1. Hook to fetch recipes list (paginated & searchable)
export function useRecipes(search?: string, page = 1) {
  return useQuery({
    queryKey: RECIPE_KEYS.list(search, page),
    queryFn: ({ signal }) =>
      recipeService.fetchRecipes(search, page, 9, signal),
    placeholderData: (previousData) => previousData, // smooth pagination transition
  });
}

// 2. Hook to fetch a single recipe's details
export function useRecipe(id: string) {
  return useQuery({
    queryKey: RECIPE_KEYS.detail(id),
    queryFn: ({ signal }) => recipeService.fetchRecipeById(id, signal),
    enabled: !!id,
  });
}

// 3. Hook to fetch current user's recipes
export function useMyRecipes() {
  return useQuery({
    queryKey: RECIPE_KEYS.my(),
    queryFn: ({ signal }) => recipeService.fetchMyRecipes(signal),
  });
}

// 4. Hook to create a new recipe
export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipeDto) => recipeService.createRecipe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECIPE_KEYS.all });
      toast.success("Recipe created successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create recipe.";
      toast.error(message);
    },
  });
}

// 5. Hook to update an existing recipe
export function useUpdateRecipe(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRecipeDto) => recipeService.updateRecipe(id, data),
    onSuccess: (updatedRecipe) => {
      // Update individual recipe cache
      queryClient.setQueryData(RECIPE_KEYS.detail(id), updatedRecipe);
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: RECIPE_KEYS.all });
      toast.success("Recipe updated successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update recipe.";
      toast.error(message);
    },
  });
}

// 6. Hook to delete a recipe (using Optimistic Updates)
export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => recipeService.deleteRecipe(id),
    // Optimistic Update Setup
    onMutate: async (idToDelete) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: RECIPE_KEYS.my() });
      await queryClient.cancelQueries({ queryKey: RECIPE_KEYS.lists() });

      // Snapshot the previous values
      const previousMyRecipes = queryClient.getQueryData<Recipe[]>(
        RECIPE_KEYS.my(),
      );

      // Optimistically update the "My Recipes" cache
      if (previousMyRecipes) {
        queryClient.setQueryData<Recipe[]>(
          RECIPE_KEYS.my(),
          previousMyRecipes.filter((recipe) => recipe.id !== idToDelete),
        );
      }

      toast.info("Deleting recipe...");

      // Return context with snapshotted values
      return { previousMyRecipes };
    },
    // If the mutation fails, rollback
    onError: (err, id, context) => {
      if (context?.previousMyRecipes) {
        queryClient.setQueryData(RECIPE_KEYS.my(), context.previousMyRecipes);
      }
      toast.error("Failed to delete recipe. Restoring list.");
    },
    // Always refetch or invalidate after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: RECIPE_KEYS.all });
      toast.success("Recipe deleted successfully!");
    },
  });
}
