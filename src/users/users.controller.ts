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
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
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
  @UseGuards(new RoleGuard(['user', 'admin']))
  @UseGuards(AuthGuard)
  getAllUsers() {
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
  // @UseGuards(RoleGuard)
  getCurrentUser(@CurrentUser() currentUser: Users) {
    return currentUser;
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    // Implement fetching a user by ID
    return this.userService.findById(id);
  }

  @Put(':id')
  @UseGuards(new RoleGuard(['user', 'admin', 'mod']))
  @UseGuards(AuthGuard)
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdateUserDto,
    @CurrentUser() currentUser: Users,
  ) {
    return this.userService.updateById(id, requestBody, currentUser);
  }
  @Delete(':id')
  @UseGuards(new RoleGuard(['user', 'admin', 'mod']))
  @UseGuards(AuthGuard)
  deleteUserById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: Users,
  ) {
    // Implement deleting a user by ID
    this.userService.deleteById(id, currentUser);
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
