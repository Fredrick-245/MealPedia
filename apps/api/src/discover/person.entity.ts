import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('people')
export class Person {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column({ default: '' })
  handle!: string;

  @Field()
  @Column({ default: '' })
  avatarUrl!: string;

  @Field()
  @Column({ default: false })
  following!: boolean;
}
