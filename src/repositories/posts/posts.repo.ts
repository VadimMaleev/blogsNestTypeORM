import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "../../types/dto";
import { PostCreateFromBlogInputModelType } from "../../types/input.models";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./post.entity";

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) protected postsRepository: Repository<Post>
  ) {}

  async createPost(newPost: CreatePostDto) {
    return this.postsRepository.save(newPost);
  }

  async deletePost(id: string): Promise<boolean> {
    await this.postsRepository.delete({ id: id });
    return true;
  }

  async updatePost(
    postId: string,
    postInputModel: PostCreateFromBlogInputModelType
  ): Promise<boolean> {
    await this.postsRepository.update(
      { id: postId },
      {
        title: postInputModel.title,
        shortDescription: postInputModel.shortDescription,
        content: postInputModel.content,
      }
    );
    return true;
  }

  async updateVisibleStatus(
    blogId: string,
    banStatus: boolean
  ): Promise<boolean> {
    await this.postsRepository.update(
      { blogId: blogId },
      { isVisible: !banStatus }
    );
    return true;
  }

  async getPostById(id: string) {
    return this.postsRepository.findOneBy({ id: id });
  }
}
