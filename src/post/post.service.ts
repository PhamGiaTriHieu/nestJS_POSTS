import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/helpers/checkPermission.helper';
import { CreatePostDto } from 'src/post/dtos/createPost.dto';
import { UpdatePostDto } from 'src/post/dtos/updatePost.dto';
import { Post } from 'src/post/post.entity';
import { Users } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {}
  // CRUD
  create(requestBody: CreatePostDto, currentUser: Users) {
    console.log('🚀 ~ PostService ~ create ~ currentUser:', currentUser);
    const newPost = this.postRepo.create(requestBody);
    newPost.user = currentUser;
    return this.postRepo.save(newPost);
  }

  getAll() {
    return this.postRepo.find();
  }

  getPost(id: number) {
    return this.postRepo.findOneBy({ id });
  }

  async updatePost(id: number, requestBody: UpdatePostDto, currentUser: Users) {
    let post = await this.getPost(id);
    if (!post) {
      throw new NotFoundException(`Post not found with id ${id}`);
    }

    post = { ...post, ...requestBody };

    Permission.check(id, currentUser);

    return this.postRepo.save(post);
  }

  async deletePost(id: number) {
    const post = await this.getPost(id);
    if (!post) {
      throw new NotFoundException(`Post not found with id ${id}`);
    }
    return this.postRepo.remove(post);
  }
}
