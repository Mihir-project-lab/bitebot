import { api } from "./axios";
import { Recipe, CreateRecipeDto, UpdateRecipeDto } from "@/types";

export interface RecipesListResponse {
  recipes: Recipe[];
  total: number;
  page: number;
  pages: number;
}

export const recipeService = {
  async fetchRecipes(
    search?: string,
    page = 1,
    limit = 9,
    signal?: AbortSignal,
  ): Promise<RecipesListResponse> {
    const params: Record<string, any> = { page, limit };
    if (search) {
      params.search = search;
    }
    const response = await api.get<RecipesListResponse>("/recipes", {
      params,
      signal,
    });
    return response.data;
  },

  async fetchRecipeById(id: string, signal?: AbortSignal): Promise<Recipe> {
    const response = await api.get<Recipe>(`/recipes/${id}`, { signal });
    return response.data;
  },

  async fetchMyRecipes(signal?: AbortSignal): Promise<Recipe[]> {
    const response = await api.get<Recipe[]>("/recipes/my", { signal });
    return response.data;
  },

  async createRecipe(data: CreateRecipeDto): Promise<Recipe> {
    const response = await api.post<Recipe>("/recipes", data);
    return response.data;
  },

  async updateRecipe(id: string, data: UpdateRecipeDto): Promise<Recipe> {
    const response = await api.patch<Recipe>(`/recipes/${id}`, data);
    return response.data;
  },

  async deleteRecipe(id: string): Promise<void> {
    await api.delete(`/recipes/${id}`);
  },
};
