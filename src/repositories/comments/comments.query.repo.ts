import {
  CommentsForResponse,
  CommentsPaginationResponse,
} from "../../types/types";
import { mapCommentWithLikes } from "../../helpers/map.comment.with.likes";
import { PaginationDto } from "../../types/dto";
import { Injectable } from "@nestjs/common";
import { LikesRepository } from "../likes/likes.repo";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    protected likesRepository: LikesRepository
  ) {}

  async getCommentById(
    id: string,
    userId: string | null
  ): Promise<CommentsForResponse | null> {
    const comment = await this.dataSource.query(
      `
        SELECT "id", "content", "userId", "userLogin", "createdAt", "postId", "isVisible",
        (
        SELECT count (*)
        FROM public."Likes"
        WHERE "idOfEntity" = $1 AND "status" = 'Like'
        ) as "likesCount",
        (
        SELECT count (*)
        FROM public."Likes"
        WHERE "idOfEntity" = $1 AND "status" = 'Dislike'
        ) as "dislikesCount",
        (
        SELECT "status"
        FROM public."Likes"
        WHERE "idOfEntity" = $1 AND "userId" = $2
        ) as "myStatus"
        
        FROM public."Comments"
        WHERE "id" = $1
      `,
      [id, userId]
    );
    console.log(comment);
    return mapCommentWithLikes(comment[0]);
  }

  async getCommentsForPost(
    id: string,
    query: PaginationDto,
    userId: string | null
  ): Promise<CommentsPaginationResponse> {
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || "createdAt";
    const sortDirection: "asc" | "desc" = query.sortDirection || "desc";

    const comments = await this.dataSource.query(
      `
        SELECT c.*,
        (
        SELECT count (*)
        FROM public."Likes" l
        WHERE c."id" = l."idOfEntity" AND l."status" = 'Like'
        ) as "likesCount",
        (
        SELECT count (*)
        FROM public."Likes" l
        WHERE c."id" = l."idOfEntity" AND l."status" = 'Dislike'
        ) as "dislikesCount",
        (
        SELECT "status"
        FROM public."Likes" l
        WHERE c."id" = l."idOfEntity" AND l."userId" = $4
        ) as "myStatus"
        
        FROM public."Comments" c
        WHERE "postId" = $1
        ORDER BY "${sortBy}" ${sortDirection}
        OFFSET $2 LIMIT $3
      `,
      [id, (pageNumber - 1) * pageSize, pageSize, userId]
    );
    const commentsWithLikes = comments.map((i) => mapCommentWithLikes(i));

    const totalCount = await this.dataSource.query(
      `
      SELECT count(*)
      FROM public."Comments"
      WHERE "postId" = $1
      `,
      [id]
    );

    return {
      pagesCount: Math.ceil(+totalCount[0].count / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: +totalCount[0].count,
      items: commentsWithLikes,
    };
  }
}
