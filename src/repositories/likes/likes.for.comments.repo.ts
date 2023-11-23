import { v4 as uuidv4 } from "uuid";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LikeForComment } from "./likeForComment.entity";

export class LikesForCommentsRepository {
  constructor(
    @InjectRepository(LikeForComment)
    protected likesForCommentsRepository: Repository<LikeForComment>
  ) {}

  async makeLikeOrUnlike(
    id: string,
    userId: string,
    login: string,
    likeStatus: string
  ) {
    const like = await this.likesForCommentsRepository.findOneBy({
      commentId: id,
      userId: userId,
    });

    if (!like) {
      await this.likesForCommentsRepository.save({
        id: uuidv4(),
        commentId: id,
        userId: userId,
        login: login,
        addedAt: new Date(),
        status: likeStatus,
        isVisible: true,
      });
    }

    if (like && like.status !== likeStatus) {
      await this.likesForCommentsRepository.update(
        { commentId: id, userId: userId },
        { status: likeStatus, addedAt: new Date() }
      );
    }
    return true;
  }
}
