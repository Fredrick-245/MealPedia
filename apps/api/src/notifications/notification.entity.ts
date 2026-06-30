import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

export type NotificationKind = 'general' | 'system';

@ObjectType()
@Entity('notifications')
export class Notification {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ default: 'general' })
  kind!: NotificationKind;

  @Field()
  @Column()
  message!: string;

  @Field()
  @Column({ default: '' })
  timeLabel!: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'varchar' })
  actorName!: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'varchar' })
  actorAvatarUrl!: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'varchar' })
  thumbnailUrl!: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'varchar' })
  iconKey!: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'varchar' })
  tag!: string | null;

  @Field(() => Int)
  @Column({ default: 0 })
  sortOrder!: number;
}
