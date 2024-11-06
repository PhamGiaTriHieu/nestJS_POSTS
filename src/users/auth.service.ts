import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dtos/registerUser.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dtos/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async register(requestBody: RegisterUserDto) {
    // check email is exist
    const userByEmail = await this.userService.findByEmail(requestBody.email);
    if (userByEmail) {
      throw new BadRequestException('Email already exists'); //  400
    }

    // hash password
    const hashPassword = await bcrypt.hash(requestBody.password, 10);
    requestBody.password = hashPassword;

    // save to db
    const savedUser = await this.userService.create(requestBody);

    // generate jwt token
    const payload = {
      id: savedUser.id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      role: savedUser.role,
      email: savedUser.email,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      msg: 'User registered successfully',
      access_token,
    };
  }

  async login(requestBody: LoginUserDto) {
    // check email is NOT exist
    const userByEmail = await this.userService.findByEmail(requestBody.email);
    if (!userByEmail) {
      throw new BadRequestException('Invalid Credentials'); //  400
    }
    // check password is correct
    const isMatchPassword = await bcrypt.compare(
      requestBody.password,
      userByEmail.password,
    );

    if (!isMatchPassword) {
      throw new BadRequestException('Invalid Credentials'); //  400
    }

    // generate jwt token
    const payload = {
      id: userByEmail.id,
      firstName: userByEmail.firstName,
      lastName: userByEmail.lastName,
      role: userByEmail.role,
      email: userByEmail.email,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      msg: 'Login successfully',
      access_token,
    };
  }
}
