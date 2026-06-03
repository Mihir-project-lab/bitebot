import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entity/orders.entity';
import { OrderItem } from './entity/orderItem.entity';
import { Food } from '../food/entity/food.entity';

export interface CreateOrderItemDto {
  foodId: number;
  quantity: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) {}

  findAll(userId: number) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: { items: { food: true } },
    });
  }

  async findOne(id: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { items: { food: true } },
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async create(userId: number, itemDtos: CreateOrderItemDto[]) {
    let total = 0;
    const items: OrderItem[] = [];

    for (const dto of itemDtos) {
      const food = await this.foodRepository.findOne({
        where: { id: dto.foodId },
      });
      if (!food) throw new NotFoundException(`Food #${dto.foodId} not found`);
      total += food.price * dto.quantity;
      const item = this.orderItemRepository.create({
        food,
        quantity: dto.quantity,
      });
      items.push(item);
    }

    const order = this.orderRepository.create({
      user: { id: userId },
      items,
      total,
    });
    return this.orderRepository.save(order);
  }
}
