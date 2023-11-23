import { v4 as uuidv4 } from "uuid";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { LikeForPost } from "./likeForPost.entity";

export class LikesForPostsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(LikeForPost)
    protected likesForPostsRepository: Repository<LikeForPost>
  ) {}

  async makeLikeOrUnlike(
    id: string,
    userId: string,
    login: string,
    likeStatus: string
  ) {
    const like = await this.likesForPostsRepository.findOneBy({
      postId: id,
      userId: userId,
    });

    if (!like) {
      await this.likesForPostsRepository.save({
        id: uuidv4(),
        postId: id,
        userId: userId,
        login: login,
        addedAt: new Date(),
        status: likeStatus,
        isVisible: true,
      });
    }

    if (like && like.status !== likeStatus) {
      await this.likesForPostsRepository.update(
        { postId: id, userId: userId },
        { status: likeStatus, addedAt: new Date() }
      );
    }
    return true;
  }
}
