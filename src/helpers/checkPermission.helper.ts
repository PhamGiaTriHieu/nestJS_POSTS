import { BadRequestException } from '@nestjs/common';
import { Users } from 'src/users/user.entity';

export class Permission {
  static check(id: number, currentUser: Users) {
    if (id === currentUser.id) return;
    if (currentUser.role === 'ADMIN') return; // admin can perform any action
    throw new BadRequestException('User cannot perform this action'); // 400
  }
}
