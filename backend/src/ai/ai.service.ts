import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private readonly groq: Groq;
  private readonly model = 'llama-3.3-70b-versatile';

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async suggestRecipes(ingredients: string[]): Promise<string> {
    const list = ingredients.join(', ');
    return this.chat([
      {
        role: 'system',
        content:
          'You are a professional chef assistant. When given a list of ingredients, suggest 3 recipes the user can make. For each recipe include a short title, brief description, and key steps. Be concise and practical.',
      },
      {
        role: 'user',
        content: `I have these ingredients: ${list}. What recipes can I make?`,
      },
    ]);
  }

  async generateRecipe(description: string): Promise<string> {
    return this.chat([
      {
        role: 'system',
        content:
          'You are a professional chef. Generate a complete, well-structured recipe based on the user\'s description. Include: title, description, ingredient list with amounts, step-by-step instructions, cook time, servings, difficulty level, and cuisine type.',
      },
      {
        role: 'user',
        content: description,
      },
    ]);
  }

  async cookingChat(
    message: string,
    history: { role: 'user' | 'assistant'; content: string }[] = [],
  ): Promise<string> {
    return this.chat([
      {
        role: 'system',
        content:
          'You are Bite Bot, a friendly and knowledgeable cooking assistant. Help users with recipes, cooking techniques, ingredient substitutions, and food-related questions. Keep answers practical and easy to follow.',
      },
      ...history,
      { role: 'user', content: message },
    ]);
  }

  private async chat(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  ): Promise<string> {
    try {
      const completion = await this.groq.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      });
      return completion.choices[0]?.message?.content ?? '';
    } catch (error) {
      throw new InternalServerErrorException(
        'AI service is temporarily unavailable. Please try again later.',
      );
    }
  }
}
