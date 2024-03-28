import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { GameStatusEnum } from "../../types/types";
import { User } from "../users/user.entity";
import { QuizQuestions } from "./quiz.questions.entity";

@Entity("Game")
export class Game {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "uuid" })
  firstPlayerId: string;

  @Column()
  firstPlayerLogin: string;

  @Column({ default: 0 })
  firstPlayerScore: number;

  @Column({ type: "uuid", nullable: true })
  secondPlayerId: string;

  @Column({ nullable: true })
  secondPlayerLogin: string;

  @Column({ default: 0 })
  secondPlayerScore: number;

  @Column({ type: "enum", enum: ["PendingSecondPlayer", "Active", "Finished"] })
  status: GameStatusEnum;

  @Column({ type: "timestamp with time zone" })
  pairCreatedDate: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  startGameDate: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  finishGameDate: Date;

  @ManyToOne(() => User, (u) => u.games)
  @JoinColumn()
  firstPlayer: User;

  @ManyToOne(() => User, (u) => u.games)
  @JoinColumn()
  secondPlayer: User;

  @OneToMany(() => QuizQuestions, (g) => g.game)
  questions: QuizQuestions[];
}
