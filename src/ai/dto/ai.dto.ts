import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class SuggestRecipesDto {
  @ApiProperty({
    type: [String],
    example: ['chicken', 'garlic', 'lemon', 'rosemary'],
    description: 'List of ingredients you have on hand',
  })
  @IsArray()
  @IsString({ each: true })
  ingredients: string[];
}

export class GenerateRecipeDto {
  @ApiProperty({
    example: 'A spicy Thai noodle dish with peanut sauce, ready in under 20 minutes',
    description: 'Describe the recipe you want to generate',
  })
  @IsString()
  description: string;
}

export class ChatMessageDto {
  @ApiProperty({ enum: ['user', 'assistant'] })
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @ApiProperty({ example: 'How do I make pasta from scratch?' })
  @IsString()
  content: string;
}

export class ChatDto {
  @ApiProperty({ example: 'What can I make with eggs and cheese?' })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    type: [ChatMessageDto],
    description: 'Previous conversation history for context',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  @IsOptional()
  history?: ChatMessageDto[];
}
