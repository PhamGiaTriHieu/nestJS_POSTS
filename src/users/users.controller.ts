import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  // Request,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { AuthService } from 'src/users/auth.service';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { LoginUserDto } from 'src/users/dtos/loginUser.dto';
// import { CreateUserDto } from 'src/users/dtos/createUser.dto';
import { RegisterUserDto } from 'src/users/dtos/registerUser.dto';
import { UpdateUserDto } from 'src/users/dtos/updateUser.dto';
import { Users } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('/api/v1/users')
@UseInterceptors(ClassSerializerInterceptor) // hide password from response
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  // @Post()
  // createUser(@Body() requestBody: RegisterUserDto) {
  //   // Implement creating a new user
  //   return this.userService.create(requestBody);
  // }

  @Get()
  @UseGuards(AuthGuard)
  getAllUsers() {
    console.log('second interceptor called');
    // Implement fetching all users
    return this.userService.findAll();
  }

  // // cach 1
  // @Get('current-user')
  // @UseGuards(AuthGuard)
  // getCurrentUser(@Request() req) {
  //   return this.authService.getCurrentUser(req);
  // }

  // cach 2: using custom decorator
  @Get('current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() currentUser: Users) {
    return currentUser;
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    // Implement fetching a user by ID
    return this.userService.findById(id);
  }

  @Put(':id')
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateUserDto,
  ) {
    return this.userService.updateById(id, requestBody);
  }
  @Delete(':id')
  deleteUserById(@Param('id', ParseIntPipe) id: number) {
    // Implement deleting a user by ID
    this.userService.deleteById(id);
  }

  @Post('register')
  registerUser(@Body() requestBody: RegisterUserDto) {
    return this.authService.register(requestBody);
  }

  @Post('login')
  LoginUser(@Body() requestBody: LoginUserDto) {
    return this.authService.login(requestBody);
  }
}
