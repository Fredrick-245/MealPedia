import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('chefs')
export class Chef {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column({ default: '' })
  fullName!: string;

  @Field()
  @Column({ default: '' })
  handle!: string;

  @Field()
  @Column({ default: '' })
  avatarUrl!: string;

  @Field(() => Int)
  @Column({ default: 0 })
  recipeCount!: number;

  @Field(() => Int)
  @Column({ default: 0 })
  followingCount!: number;

  @Field(() => Int)
  @Column({ default: 0 })
  followersCount!: number;

  @Field()
  @Column({ default: false })
  following!: boolean;

  @Field()
  @Column({ default: '', type: 'text' })
  bio!: string;

  @Field()
  @Column({ default: '' })
  whatsapp!: string;

  @Field()
  @Column({ default: '' })
  facebook!: string;

  @Field()
  @Column({ default: '' })
  twitter!: string;

  @Field()
  @Column({ default: '' })
  instagram!: string;

  @Field()
  @Column({ default: '' })
  website!: string;

  @Field()
  @Column({ default: '' })
  location!: string;

  @Field()
  @Column({ default: '' })
  joinedLabel!: string;

  @Field(() => Int)
  @Column({ default: 0 })
  views!: number;

  @Field(() => Int)
  @Column({ default: 0 })
  sortOrder!: number;
}
