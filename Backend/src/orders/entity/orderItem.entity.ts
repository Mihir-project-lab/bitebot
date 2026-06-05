import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './orders.entity';
import { Food } from '../../food/entity/food.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, (order) => order.items)
  order!: Order;

  @ManyToOne(() => Food)
  food!: Food;

  @Column()
  quantity!: number;
}
