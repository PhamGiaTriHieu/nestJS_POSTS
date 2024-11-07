import { IsEmail, IsNotEmpty } from 'class-validator';
import { ROLES } from 'src/users/user.entity';

export class UpdateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  role: ROLES;
}
