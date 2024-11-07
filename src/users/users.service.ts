import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/helpers/checkPermission.helper';
// import { CreateUserDto } from 'src/users/dtos/createUser.dto';
import { RegisterUserDto } from 'src/users/dtos/registerUser.dto';
import { UpdateUserDto } from 'src/users/dtos/updateUser.dto';
import { Users } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

  async updateById(id: number, requestBody: UpdateUserDto, currentUser: Users) {
    if (requestBody.role) {
      throw new BadRequestException('Cannot update role');
    }
    const findUserById = await this.findById(id);

    if (!findUserById) {
      throw new NotFoundException('cannot update user, user not found');
    }
    // only current user can update their details
    Permission.check(id, currentUser);

    const hashPassword = await bcrypt.hash(requestBody.password, 10);
    requestBody.password = hashPassword;
    const updateUser = { ...findUserById, ...requestBody };
    console.log('🚀 ~ UsersService ~ updateById ~ updateUser:', updateUser);
    const result = await this.usersRepo.save(updateUser);
    console.log('successfully updated user');
    return {
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
    };
  }

  async deleteById(id: number, currentUser: Users) {
    const findUserById = await this.findById(id);
    if (!findUserById) {
      throw new NotFoundException('cannot delete user, user not found!');
    }
    Permission.check(id, currentUser);
    return this.usersRepo.remove(findUserById);
  }
}
