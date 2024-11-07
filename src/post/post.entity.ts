import { Transform } from 'class-transformer';
import { Users } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @CreateDateColumn()
  updateAt: Date;

  @ManyToOne(() => Users, (user) => user.posts)
  @Transform(({ obj }) => obj.user.id) // Example of transforming entity data to DTOs
  user: Users;
}
