import { Injectable } from "@nestjs/common";
import { CreateCommentDto } from "../../types/dto";
import { plugForCreatingComment } from "../../helpers/plug.for.creating.posts.and.comments";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Comment } from "./comment.entity";

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Comment) protected commentsRepository: Repository<Comment>
  ) {}
  async deleteComment(id: string): Promise<boolean> {
    await this.commentsRepository.delete({ id: id });
    return true;
  }

  async createComment(newComment: CreateCommentDto) {
    await this.commentsRepository.save(newComment);
    return plugForCreatingComment(newComment);
  }

  async updateComment(id: string, content: string): Promise<boolean> {
    await this.commentsRepository.update({ id: id }, { content: content });
    return true;
  }

  // async updateVisibleStatus(userId: string, banStatus: boolean) {
  //   await this.commentModel.updateMany(
  //     { userId: userId },
  //     { isVisible: !banStatus }
  //   );
  // }

  async findCommentById(id: string) {
    return this.commentsRepository.findOneBy({ id: id });
  }
}
