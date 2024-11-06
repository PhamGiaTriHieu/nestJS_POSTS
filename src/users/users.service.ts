import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { CreateUserDto } from 'src/users/dtos/createUser.dto';
import { RegisterUserDto } from 'src/users/dtos/registerUser.dto';
import { UpdateUserDto } from 'src/users/dtos/updateUser.dto';
import { Users } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private usersRepo: Repository<Users>) {}

  //   CRUD
  create(requestBody: RegisterUserDto) {
    const newUser = this.usersRepo.create(requestBody);
    return this.usersRepo.save(newUser);
  }

  findAll() {
    return this.usersRepo.find();
  }

  async findById(id: number) {
    const result = await this.usersRepo.findOneBy({ id });
    if (!result) {
      //   return { message: 'User not found', success: false };
      throw new NotFoundException('User not found');
    }
    return this.usersRepo.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.usersRepo.findOneBy({ email });
  }

  async updateById(id: number, requestBody: UpdateUserDto) {
    const findUserById = await this.findById(id);

    if (!findUserById) {
      throw new NotFoundException('cannot update user, user not found');
    }
    const updateUser = { ...findUserById, ...requestBody };
    return this.usersRepo.save(updateUser);
  }

  async deleteById(id: number) {
    const findUserById = await this.findById(id);
    if (!findUserById) {
      throw new NotFoundException('cannot delete user, user not found!');
    }
    return this.usersRepo.remove(findUserById);
  }
}
