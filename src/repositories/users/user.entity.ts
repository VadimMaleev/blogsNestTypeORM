import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { RecoveryCode } from "../recovery.codes/recovery.code.entity";
import { Device } from "../devices/device.entity";
import { Comment } from "../comments/comment.entity";
import { LikeForPost } from "../likes/likeForPost.entity";
import { LikeForComment } from "../likes/likeForComment.entity";
import { Game } from "../quiz/game.entity";
import { Answer } from "../quiz/answer.entity";

@Entity("User")
export class User {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column({ nullable: true })
  confirmationCode: string;

  @Column({ type: "timestamp with time zone", nullable: true })
  codeExpirationDate: Date;

  @Column()
  isConfirmed: boolean;

  @Column()
  isBanned: boolean;

  @Column({ type: "timestamp with time zone", nullable: true })
  banDate: Date;

  @Column({ nullable: true })
  banReason: string;

  @OneToOne(() => RecoveryCode, (r) => r.user)
  recoveryCode: RecoveryCode;

  @OneToMany(() => Device, (d) => d.user)
  devices: Device[];

  @OneToMany(() => Comment, (c) => c.user)
  comments: Comment[];

  @OneToMany(() => LikeForPost, (l) => l.user)
  likesForPost: LikeForPost[];

  @OneToMany(() => LikeForComment, (l) => l.user)
  likesForComment: LikeForComment[];

  @OneToMany(() => Game, (g) => [g.firstPlayer, g.secondPlayer])
  games: Game[];

  @OneToMany(() => Answer, (a) => a.user)
  answers: Answer[];
}
