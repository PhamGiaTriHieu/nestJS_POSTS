import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Post } from 'src/post/post.entity';

export enum ROLES {
  ADMIN = 'ADMIN',
  MOD = 'MOD',
  USER = 'USER',
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  // @Column({default: })
  // name: string;

  @Column()
  email: string;

  @Column()
  @Exclude() // Exclude password from response, hide password from response
  password: string;

  @Column({ default: ROLES.USER })
  @Exclude()
  role: ROLES;

  // One => User, Many => Post
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
