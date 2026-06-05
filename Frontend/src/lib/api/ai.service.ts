import { api } from './axios';
import { ChatMessage, Recipe, AIGeneratedRecipe } from '@/types';

// Helper to parse unstructured markdown recipes from the AI generator into structured objects
function parseRecipeMarkdown(markdown: string): AIGeneratedRecipe {
  const lines = markdown.split('\n').map((l) => l.trim());
  
  let title = 'AI Generated Recipe';
  let description = '';
  let cuisine = 'General';
  let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  let cookTimeMinutes = 30;
  let servings = 4;
  const ingredients: { name: string; amount: string }[] = [];
  const steps: string[] = [];
  const tags: string[] = [];

  let section: 'none' | 'description' | 'ingredients' | 'steps' = 'none';

  // 1. Try to extract Title from the first few lines
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    if (line.startsWith('**') && line.endsWith('**')) {
      title = line.replace(/\*\*/g, '').replace(/Recipe$/i, '').trim();
      break;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Remove bolding asterisks to make parsing easy and robust
    const cleanLine = line.replace(/\*\*/g, '').trim();
    const lowerLine = cleanLine.toLowerCase();

    // Identify section transitions
    if (lowerLine.startsWith('description:')) {
      description = cleanLine.substring(12).trim();
      section = 'none';
      continue;
    } else if (lowerLine.startsWith('ingredient list:') || lowerLine.startsWith('ingredients:')) {
      section = 'ingredients';
      continue;
    } else if (
      lowerLine.startsWith('step-by-step instructions:') ||
      lowerLine.startsWith('instructions:') ||
      lowerLine.startsWith('directions:') ||
      lowerLine.startsWith('steps:')
    ) {
      section = 'steps';
      continue;
    }

    // Parse metadata lines
    if (lowerLine.startsWith('cook time:')) {
      section = 'none';
      const numMatch = cleanLine.match(/\d+/);
      if (numMatch) cookTimeMinutes = parseInt(numMatch[0]);
      continue;
    }
    if (lowerLine.startsWith('servings:')) {
      section = 'none';
      const numMatch = cleanLine.match(/\d+/);
      if (numMatch) servings = parseInt(numMatch[0]);
      continue;
    }
    if (lowerLine.startsWith('difficulty level:') || lowerLine.startsWith('difficulty:')) {
      section = 'none';
      const val = cleanLine.split(':')[1]?.trim().toLowerCase() || 'medium';
      if (val.includes('easy')) difficulty = 'easy';
      else if (val.includes('hard')) difficulty = 'hard';
      else difficulty = 'medium';
      continue;
    }
    if (lowerLine.startsWith('cuisine type:') || lowerLine.startsWith('cuisine:')) {
      section = 'none';
      cuisine = cleanLine.split(':')[1]?.trim() || 'General';
      continue;
    }
    if (lowerLine.startsWith('tags:')) {
      section = 'none';
      const val = cleanLine.split(':')[1]?.trim() || '';
      const splitTags = val.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
      tags.push(...splitTags);
      continue;
    }

    // Parse list rows depending on the current active section
    if (section === 'ingredients') {
      if (cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
        const clean = cleanLine.replace(/^[-*+]\s+/, '').trim();
        // Regex to separate units/amounts from ingredient names
        const numUnitRegex = /^((?:\d+\s+\d+\/\d+|\d+\/\d+|\d+\.\d+|\d+|[\u00BC-\u00BE\u2150-\u215E]+)(?:\s*(?:tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons|cup|cups|g|gram|grams|ml|l|oz|ounce|ounces|pound|pounds|lb|lbs|clove|cloves|medium|large|small|pinch|pinches|slice|slices|can|cans|pkg|package|packages)\b)?)(.*)$/i;
        const match = clean.match(numUnitRegex);
        if (match) {
          const amt = match[1].trim();
          const name = match[2].trim().replace(/^of\s+/i, '');
          ingredients.push({ name: name || 'Ingredient', amount: amt || 'As needed' });
        } else {
          ingredients.push({ name: clean, amount: 'As needed' });
        }
      }
    } else if (section === 'steps') {
      if (/^\d+\./.test(cleanLine)) {
        steps.push(cleanLine.replace(/^\d+\.\s*/, '').trim());
      }
    }
  }

  // Fallbacks
  if (!description && steps.length > 0) {
    description = `Enjoy this delicious ${cuisine.toLowerCase()} recipe.`;
  }
  if (tags.length === 0) {
    tags.push(cuisine.toLowerCase(), difficulty, 'ai-chef');
  }

  return {
    title,
    description,
    cuisine,
    difficulty,
    cookTimeMinutes,
    servings,
    ingredients: ingredients.length > 0 ? ingredients : [{ name: 'Ingredient', amount: 'As needed' }],
    steps: steps.length > 0 ? steps : ['Cook and serve.'],
    tags,
  };
}

// Helper to parse unstructured recipe suggestions markdown from the AI suggest endpoint
function parseSuggestionsMarkdown(markdown: string): Recipe[] {
  const lines = markdown.split('\n').map((l) => l.trim());
  const suggestions: Recipe[] = [];
  
  let currentRecipe: Partial<Recipe> | null = null;
  let index = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Remove bolding asterisks to make parsing easy and robust
    const cleanLine = line.replace(/\*\*/g, '').trim();
    const lowerLine = cleanLine.toLowerCase();

    // Check for recipe start: e.g. "1. Lemon Rosemary Chicken"
    const match = cleanLine.match(/^\d+\.\s*(.*)$/);
    if (match) {
      if (currentRecipe) {
        suggestions.push(currentRecipe as Recipe);
      }
      currentRecipe = {
        id: `suggested-${index++}`,
        title: match[1].trim(),
        description: '',
        cuisine: 'Suggested',
        difficulty: 'medium',
        cookTimeMinutes: 20,
        servings: 4,
        ingredients: [],
        steps: [],
        tags: ['suggested'],
      };
      continue;
    }

    if (currentRecipe) {
      if (lowerLine.startsWith('description:')) {
        currentRecipe.description = cleanLine.substring(12).trim();
      } else if (lowerLine.startsWith('key steps:')) {
        const stepText = cleanLine.substring(10).trim();
        currentRecipe.steps = [stepText];
      }
    }
  }

  if (currentRecipe) {
    suggestions.push(currentRecipe as Recipe);
  }

  return suggestions;
}

export const aiService = {
  async suggestRecipes(ingredients: string[], signal?: AbortSignal): Promise<Recipe[]> {
    const response = await api.post<{ suggestions: string }>('/ai/suggest', { ingredients }, { signal });
    return parseSuggestionsMarkdown(response.data.suggestions);
  },

  async generateRecipe(description: string, signal?: AbortSignal): Promise<AIGeneratedRecipe> {
    const response = await api.post<{ recipe: string }>('/ai/generate', { description }, { signal });
    return parseRecipeMarkdown(response.data.recipe);
  },

  async chatWithAI(
    message: string,
    history: Omit<ChatMessage, 'id'>[],
    signal?: AbortSignal
  ): Promise<{ reply: string }> {
    const response = await api.post<{ reply: string }>('/ai/chat', { message, history }, { signal });
    return response.data;
  },
};
