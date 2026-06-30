import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fullName!: string;

  @Column()
  phoneNumber!: string;

  @Column({ nullable: true, type: 'varchar' })
  gender!: string | null;

  @Column({ type: 'date' })
  dateOfBirth!: string;

  @Column({ nullable: true, type: 'text' })
  avatarUri!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  country!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  cookingLevel!: string | null;

  @Column({ type: 'simple-array', default: '' })
  cuisines!: string[];

  @Column({ type: 'simple-array', default: '' })
  dietary!: string[];

  @Index({ unique: true })
  @Column()
  username!: string;

  @Index({ unique: true })
  @Column()
  email!: string;

  @Column()
  passwordHash!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
