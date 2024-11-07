import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/post/post.entity';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Users])],
  providers: [PostService, UsersService],
  controllers: [PostController],
})
export class PostModule {}
