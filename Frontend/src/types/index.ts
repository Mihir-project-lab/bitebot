export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  cookTimeMinutes: number;
  servings: number;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  authorId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateRecipeDto {
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  cookTimeMinutes: number;
  servings: number;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface UpdateRecipeDto extends Partial<CreateRecipeDto> {}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface AISuggestionResponse {
  recipes: Partial<Recipe>[];
}

export interface AIGeneratedRecipe {
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  cookTimeMinutes: number;
  servings: number;
  cuisine: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}
