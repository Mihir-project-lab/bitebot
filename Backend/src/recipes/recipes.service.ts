import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Recipe } from './entity/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  findAll(search?: string): Promise<Recipe[]> {
    if (search) {
      return this.recipeRepository.find({
        where: [
          { title: ILike(`%${search}%`) },
          { cuisine: ILike(`%${search}%`) },
        ],
        order: { createdAt: 'DESC' },
      });
    }
    return this.recipeRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({ where: { id } });
    if (!recipe) throw new NotFoundException(`Recipe #${id} not found`);
    return recipe;
  }

  findByAuthor(userId: number): Promise<Recipe[]> {
    return this.recipeRepository.find({
      where: { author: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: CreateRecipeDto, userId: number): Promise<Recipe> {
    const recipe = this.recipeRepository.create({
      ...dto,
      author: { id: userId },
    });
    return this.recipeRepository.save(recipe);
  }

  async update(id: number, dto: UpdateRecipeDto, userId: number): Promise<Recipe> {
    const recipe = await this.findOne(id);
    if (recipe.author.id !== userId) {
      throw new ForbiddenException('You can only edit your own recipes');
    }
    Object.assign(recipe, dto);
    return this.recipeRepository.save(recipe);
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const recipe = await this.findOne(id);
    if (recipe.author.id !== userId) {
      throw new ForbiddenException('You can only delete your own recipes');
    }
    await this.recipeRepository.remove(recipe);
    return { message: `Recipe #${id} deleted` };
  }
}
