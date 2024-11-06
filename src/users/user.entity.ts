import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

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
}
