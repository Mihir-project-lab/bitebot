import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entity/orders.entity';
import { OrderItem } from './entity/orderItem.entity';
import { Food } from '../food/entity/food.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Food])],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
