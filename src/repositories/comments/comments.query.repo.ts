import {
  CommentsForResponse,
  CommentsPaginationResponse,
} from "../../types/types";
import { mapCommentWithLikes } from "../../helpers/map.comment.with.likes";
import { PaginationDto } from "../../types/dto";
import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { LikeForComment } from "../likes/likeForComment.entity";
import { Comment } from "./comment.entity";

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Comment)
    protected commentsRepository: Repository<Comment>
  ) {}

  async getCommentById(
    id: string,
    userId: string | null
  ): Promise<CommentsForResponse | null> {
    const comment = await this.commentsRepository
      .createQueryBuilder("c")
      .addSelect(
        (qb) =>
          qb
            .select("count(*)")
            .from(LikeForComment, "lfc")
            .where("c.id = lfc.commentId")
            .andWhere("lfc.status = 'Like'"),
        "likesCount"
      )
      .addSelect(
        (qb) =>
          qb
            .select("count(*)")
            .from(LikeForComment, "lfc")
            .where("c.id = lfc.commentId")
            .andWhere("lfc.status = 'Dislike'"),
        "dislikesCount"
      )
      .addSelect(
        (qb) =>
          qb
            .select("status")
            .from(LikeForComment, "lfc")
            .where("c.id = lfc.commentId")
            .andWhere("lfc.userId = :userId", { userId: userId }),
        "myStatus"
      )
      .where("c.id = :id", { id: id })
      .getRawMany();
    if (!comment[0]) return null;
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
    const sortDirection = query.sortDirection
      ? query.sortDirection.toUpperCase()
      : "DESC";

    const comments = await this.commentsRepository
      .createQueryBuilder("c")
      .addSelect(
        (qb) =>
          qb
            .select("count(*)")
            .from(LikeForComment, "lfc")
            .where("c.id = lfc.commentId")
            .andWhere("lfc.status = 'Like'"),
        "likesCount"
      )
      .addSelect(
        (qb) =>
          qb
            .select("count(*)")
            .from(LikeForComment, "lfc")
            .where("c.id = lfc.commentId")
            .andWhere("lfc.status = 'Dislike'"),
        "dislikesCount"
      )
      .addSelect(
        (qb) =>
          qb
            .select("status")
            .from(LikeForComment, "lfc")
            .where("c.id = lfc.commentId")
            .andWhere("lfc.userId = :userId", { userId: userId }),
        "myStatus"
      )
      .where("c.postId = :postId", { postId: id })
      .orderBy(`"${sortBy}"`, sortDirection as "ASC" | "DESC")
      .offset(pageNumber - 1)
      .limit(pageSize)
      .getRawMany();

    const commentsWithLikes = comments.map((i) => mapCommentWithLikes(i));

    const totalCount = await this.commentsRepository.count({
      where: { postId: id },
    });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: commentsWithLikes,
    };
  }
}
