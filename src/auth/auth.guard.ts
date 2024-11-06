import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      // 1. Get token from request headers
      const [, token] = request.headers.authorization?.split(' ') ?? [];
      if (!token) {
        throw new ForbiddenException(
          'Token is required. Please provide access token',
        ); // 403
      }

      // 2. jwtVerify Validate the token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // 3. Find user in db based on jwtVerify
      const user = await this.userService.findByEmail(payload.email);
      if (!user) {
        throw new BadRequestException(
          'User not belong to token, please try again',
        ); // 400
      }

      // 4. Assign user to request object
      request.currentUser = user;
    } catch (error) {
      console.log('🚀 ~ AuthGuard ~ error:', error);
      throw new ForbiddenException('Invalid token or expired token'); // 403
    }
    return true;
  }
}
