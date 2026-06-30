import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Ingredient {
  @Field()
  text!: string;

  @Field()
  emoji!: string;
}

@ObjectType()
export class InstructionStep {
  @Field()
  text!: string;

  @Field(() => [String])
  images!: string[];
}

export type RecipeCategory =
  | 'recent'
  | 'yours'
  | 'bookmark'
  | 'popular'
  | 'recommendations'
  | 'searches'
  | 'new'
  | 'saved'
  | 'chef';

@ObjectType()
@Entity('recipes')
export class Recipe {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column('text')
  description!: string;

  @Field()
  @Column({ default: 30 })
  prepTimeMinutes!: number;

  @Field()
  @Column({ default: '' })
  cookTime!: string;

  @Field()
  @Column({ default: '' })
  origin!: string;

  @Field()
  @Column({ default: false })
  isOwn!: boolean;

  @Field()
  @Column({ default: true })
  published!: boolean;

  @Column({ default: false })
  isSeed!: boolean;

  @Field()
  @Column({ default: '' })
  imageUrl!: string;

  @Field(() => [String])
  @Column({ type: 'jsonb', nullable: true })
  galleryUrls!: string[];

  @Field()
  @Column({ default: '' })
  authorName!: string;

  @Field()
  @Column({ default: '' })
  authorHandle!: string;

  @Field()
  @Column({ default: '' })
  authorAvatarUrl!: string;

  @Field(() => Int)
  @Column({ default: 1 })
  servings!: number;

  @Field(() => Int)
  @Column({ default: 0 })
  calories!: number;

  @Field(() => Int)
  @Column({ default: 0 })
  commentCount!: number;

  @Field(() => [Ingredient])
  @Column({ type: 'jsonb', nullable: true })
  ingredients!: Ingredient[];

  @Field(() => [InstructionStep])
  @Column({ type: 'jsonb', nullable: true })
  instructions!: InstructionStep[];

  @Field()
  @Column({ default: 'recent' })
  category!: RecipeCategory;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'varchar' })
  foodCategory!: string | null;

  @Field()
  @Column({ default: false })
  bookmarked!: boolean;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}
