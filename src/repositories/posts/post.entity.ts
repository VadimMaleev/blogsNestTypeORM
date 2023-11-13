import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Blog } from "../blogs/blog.entity";

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
}
