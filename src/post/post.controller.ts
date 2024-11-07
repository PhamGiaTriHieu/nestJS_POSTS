import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreatePostDto } from 'src/post/dtos/createPost.dto';
import { UpdatePostDto } from 'src/post/dtos/updatePost.dto';
import { PostService } from 'src/post/post.service';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { Users } from 'src/users/user.entity';

@Controller('api/v1/post')
@UseInterceptors(ClassSerializerInterceptor) // For transforming entity data to DTOs
export class PostController {
  constructor(private postService: PostService) {}

  // CRUD methods here
  @Post()
  @UseGuards(AuthGuard)
  createPost(
    @Body() requestBody: CreatePostDto,
    @CurrentUser() currentUser: Users,
  ) {
    return this.postService.create(requestBody, currentUser);
  }

  //   [GET] all posts
  @Get()
  getAllPosts() {
    return this.postService.getAll();
  }

  //   [GET] a post
  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPost(id);
  }

  //   [PUT] update a post
  @Put(':id')
  @UseGuards(AuthGuard)
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestBody: UpdatePostDto,
    @CurrentUser() currentUser: Users,
  ) {
    return this.postService.updatePost(id, requestBody, currentUser);
  }

  //   [DELETE] delete a post
  @Delete(':id')
  @UseGuards(AuthGuard)
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postService.deletePost(id);
  }
}
