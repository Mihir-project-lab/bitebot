import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { SuggestRecipesDto, GenerateRecipeDto, ChatDto } from './dto/ai.dto';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('suggest')
  @ApiOperation({
    summary: 'Suggest recipes based on ingredients you have',
    description: 'Provide a list of available ingredients and get 3 recipe suggestions from the AI.',
  })
  suggest(@Body() dto: SuggestRecipesDto) {
    return this.aiService
      .suggestRecipes(dto.ingredients)
      .then((reply) => ({ suggestions: reply }));
  }

  @Post('generate')
  @ApiOperation({
    summary: 'Generate a full recipe from a description',
    description: 'Describe what kind of recipe you want and the AI will generate a complete recipe.',
  })
  generate(@Body() dto: GenerateRecipeDto) {
    return this.aiService
      .generateRecipe(dto.description)
      .then((reply) => ({ recipe: reply }));
  }

  @Post('chat')
  @ApiOperation({
    summary: 'Chat with Bite Bot cooking assistant',
    description:
      'Ask anything cooking-related. Pass conversation history to maintain context across turns.',
  })
  chat(@Body() dto: ChatDto) {
    return this.aiService
      .cookingChat(dto.message, dto.history)
      .then((reply) => ({ reply }));
  }
}
