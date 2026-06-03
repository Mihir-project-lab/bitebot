import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from './entity/food.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) {}

  findAll() {
    return this.foodRepository.find();
  }

  async findOne(id: number) {
    const food = await this.foodRepository.findOne({ where: { id } });
    if (!food) throw new NotFoundException(`Food #${id} not found`);
    return food;
  }

  create(body: Partial<Food>) {
    const food = this.foodRepository.create(body);
    return this.foodRepository.save(food);
  }

  async update(id: number, body: Partial<Food>) {
    await this.findOne(id);
    await this.foodRepository.update(id, body);
    return this.findOne(id);
  }

  async remove(id: number) {
    const food = await this.findOne(id);
    return this.foodRepository.remove(food);
  }
}
