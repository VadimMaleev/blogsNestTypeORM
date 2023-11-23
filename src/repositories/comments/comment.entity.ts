import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Post } from "../posts/post.entity";
import { User } from "../users/user.entity";
import { LikeForComment } from "../likes/likeForComment.entity";

@Entity("Comment")
export class Comment {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column()
  content: string;

  @Column({ type: "uuid" })
  userId: string;

  @Column()
  userLogin: string;

  @Column({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column({ type: "uuid" })
  postId: string;

  @Column()
  isVisible: boolean;

  @ManyToOne(() => Post, (p) => p.comments)
  post: Post;

  @ManyToOne(() => User, (u) => u.comments)
  user: User;

  @OneToMany(() => LikeForComment, (l) => l.comment)
  likesForComment: LikeForComment[];
}
