import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('comments')
export class Comment {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  recipeId!: string | null;

  @Field()
  @Column({ default: '' })
  authorName!: string;

  @Field()
  @Column({ default: '' })
  authorAvatarUrl!: string;

  @Field()
  @Column('text')
  text!: string;

  @Field(() => Int)
  @Column({ default: 0 })
  likes!: number;

  @Field()
  @Column({ default: '' })
  timeLabel!: string;

  @Field(() => Int)
  @Column({ default: 0 })
  sortOrder!: number;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}
