import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "../posts/post.entity";
import { User } from "../users/user.entity";

@Entity("LikeForPost")
export class LikeForPost {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "uuid" })
  postId: string;

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

  @ManyToOne(() => Post, (p) => p.likesForPost)
  post: Post;

  @ManyToOne(() => User, (u) => u.comments)
  user: User;
}
