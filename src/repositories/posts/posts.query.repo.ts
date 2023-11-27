import { Injectable } from "@nestjs/common";
import { PostsForResponse, PostsPaginationResponse } from "../../types/types";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Post } from "./post.entity";
import { mapPostWithLikes } from "../../helpers/map.post.with.likes";
import { LikeForPost } from "../likes/likeForPost.entity";
import { PaginationInputModel } from "../../types/input.models";

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
    const post = await this.postsRepository
      .createQueryBuilder("p")
      .addSelect(
        (qb) =>
          qb
            .select("count(*)")
            .from(LikeForPost, "lfp")
            .where("p.id = lfp.postId")
            .andWhere("lfp.status = 'Like'"),
        "likesCount"
      )
      .addSelect(
        (qb) =>
          qb
            .select("count(*)")
            .from(LikeForPost, "lfp")
            .where("p.id = lfp.postId")
            .andWhere("lfp.status = 'Dislike'"),
        "dislikesCount"
      )
      .addSelect(
        (qb) =>
          qb
            .select("status")
            .from(LikeForPost, "lfp")
            .where("p.id = lfp.postId")
            .andWhere("lfp.userId = :userId", { userId: userId }),
        "myStatus"
      )
      .addSelect(
        `ARRAY (SELECT row_to_json(row) FROM (SELECT "addedAt", "userId", "login" FROM public."LikeForPost" WHERE "postId" = '${id}' AND "status" = 'Like' ORDER BY "addedAt" DESC LIMIT 3) row) as "newestLikes"`
      )
      .where("p.id = :id", { id: id })
      .andWhere(`"isVisible" = true`)
      .getRawMany();
    if (!post[0]) return null;
    return mapPostWithLikes(post[0]);
  }

  async getPosts(
    query: PaginationInputModel,
    userId: string | null,
    blogId?: string
  ): Promise<PostsPaginationResponse> {
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || "createdAt";
    const sortDirection = query.sortDirection || "DESC";

    const posts = await this.postsRepository
      .createQueryBuilder("p")
      .addSelect(
        (qb) =>
          qb
            .select("count(*)")
            .from(LikeForPost, "lfp")
            .where("p.id = lfp.postId")
            .andWhere("lfp.status = 'Like'"),
        "likesCount"
      )
      .addSelect(
        (qb) =>
          qb
            .select("count(*)")
            .from(LikeForPost, "lfp")
            .where("p.id = lfp.postId")
            .andWhere("lfp.status = 'Dislike'"),
        "dislikesCount"
      )
      .addSelect(
        (qb) =>
          qb
            .select("status")
            .from(LikeForPost, "lfp")
            .where("p.id = lfp.postId")
            .andWhere("lfp.userId = :userId", { userId: userId }),
        "myStatus"
      )
      .addSelect(
        `ARRAY (SELECT row_to_json(row) FROM (SELECT "addedAt", "userId", "login" FROM public."LikeForPost" WHERE "postId" = p.id AND "status" = 'Like' ORDER BY "addedAt" DESC LIMIT 3) row) as "newestLikes"`
      )
      .where(`${blogId ? '"blogId" = :blogId' : '"blogId" IS NOT NULL'}`, {
        blogId,
      })
      .andWhere(`"isVisible" = true`)
      .orderBy(`"${sortBy}"`, sortDirection as "ASC" | "DESC")
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .getRawMany();

    const postsWithLikes = posts.map((i) => mapPostWithLikes(i));

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
