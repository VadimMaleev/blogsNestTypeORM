import { Injectable } from "@nestjs/common";
import { PostsForResponse, PostsPaginationResponse } from "../../types/types";
import { PaginationDto } from "../../types/dto";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Post } from "./post.entity";
import { plugForCreatingPosts } from "../../helpers/plug.for.creating.posts.and.comments";

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Post) protected postsRepository: Repository<Post>
  ) {}

  async findPostById(
    id: string,
    userId: string | null
  ): Promise<PostsForResponse | null> {
    const post = await this.postsRepository.findOneBy({ id: id });
    if (!post) return null;
    return plugForCreatingPosts(post);
  }

  async getPosts(
    query: PaginationDto,
    userId: string | null
  ): Promise<PostsPaginationResponse> {
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || "createdAt";
    const sortDirection: "asc" | "desc" = query.sortDirection || "desc";

    const posts = await this.postsRepository.find({
      where: { isVisible: true },
      order: { [sortBy]: sortDirection },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const postsWithLikes = posts.map((i) => plugForCreatingPosts(i));

    const totalCount = await this.postsRepository.count({
      where: { isVisible: true },
    });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: postsWithLikes,
    };
  }

  async getPostsForBlog(
    blogId: string,
    query: PaginationDto,
    userId: string | null
  ): Promise<PostsPaginationResponse> {
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || "createdAt";
    const sortDirection: "asc" | "desc" = query.sortDirection || "desc";

    const posts = await this.postsRepository.find({
      where: { blogId: blogId, isVisible: true },
      order: { [sortBy]: sortDirection },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const postsWithLikes = posts.map((i) => plugForCreatingPosts(i));

    const totalCount = await this.postsRepository.count({
      where: { blogId: blogId, isVisible: true },
    });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: postsWithLikes,
    };
  }
}
