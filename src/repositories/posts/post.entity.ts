import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Blog } from "../blogs/blog.entity";
import { Comment } from "../comments/comment.entity";
import { LikeForPost } from "../likes/likeForPost.entity";

@Entity("Post")
export class Post {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @Column({ type: "uuid" })
  blogId: string;

  @Column()
  blogName: string;

  @Column({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column()
  isVisible: boolean;

  @ManyToOne(() => Blog, (b) => b.posts)
  @JoinColumn()
  blog: Blog;

  @OneToMany(() => Comment, (c) => c.post)
  comments: Comment[];

  @OneToMany(() => LikeForPost, (l) => l.post)
  likesForPost: LikeForPost[];
}
