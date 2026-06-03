import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Order } from '../../orders/entity/orders.entity';

@Entity()
export class Food {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description?: string;

  @Column()
  price!: number;

  @Column('text', { array: true, nullable: true })
  tags!: string[];

  @ManyToMany(() => Order)
  orders!: Order[];
}
