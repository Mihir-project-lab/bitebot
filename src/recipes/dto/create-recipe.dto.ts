import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsIn,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class IngredientDto {
  @ApiProperty({ example: 'Flour' })
  @IsString()
  name!: string;

  @ApiProperty({ example: '2 cups' })
  @IsString()
  amount!: string;
}

export class CreateRecipeDto {
  @ApiProperty({ example: 'Classic Spaghetti Carbonara' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: 'A rich and creamy Italian pasta dish.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: [IngredientDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients!: IngredientDto[];

  @ApiProperty({
    type: [String],
    example: ['Boil pasta', 'Mix eggs and cheese', 'Combine'],
  })
  @IsArray()
  @IsString({ each: true })
  steps!: string[];

  @ApiPropertyOptional({ example: 30 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  cookTimeMinutes?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  servings?: number;

  @ApiPropertyOptional({ example: 'Italian' })
  @IsString()
  @IsOptional()
  cuisine?: string;

  @ApiPropertyOptional({ enum: ['easy', 'medium', 'hard'], example: 'medium' })
  @IsIn(['easy', 'medium', 'hard'])
  @IsOptional()
  difficulty?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['pasta', 'italian', 'quick'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
