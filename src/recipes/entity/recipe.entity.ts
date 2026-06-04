import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';

export interface Ingredient {
  name: string;
  amount: string;
}

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column('jsonb')
  ingredients!: Ingredient[];

  @Column('text', { array: true })
  steps!: string[];

  @Column({ nullable: true })
  cookTimeMinutes?: number;

  @Column({ nullable: true })
  servings?: number;

  @Column({ nullable: true })
  cuisine?: string;

  @Column({ default: 'medium' })
  difficulty!: string;

  @Column('text', { array: true, nullable: true })
  tags?: string[];

  @ManyToOne(() => User, (user) => user.recipes, { eager: true, onDelete: 'CASCADE' })
  author!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
