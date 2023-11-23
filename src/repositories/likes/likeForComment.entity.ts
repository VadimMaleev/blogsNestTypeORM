import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Comment } from "../comments/comment.entity";

@Entity("LikeForComment")
export class LikeForComment {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "uuid" })
  commentId: string;

  @Column({ type: "uuid" })
  userId: string;

  @Column()
  login: string;

  @Column({ type: "timestamp with time zone" })
  addedAt: Date;

  @Column()
  status: string;

  @Column()
  isVisible: boolean;

  @ManyToOne(() => Comment, (c) => c.likesForComment)
  comment: Comment;

  @ManyToOne(() => User, (u) => u.comments)
  user: User;
}
