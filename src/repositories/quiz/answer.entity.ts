import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { AnswersEnum } from "../../types/types";
import { User } from "../users/user.entity";

@Entity("Answer")
export class Answer {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "uuid" })
  gameId: string;

  @Column({ type: "uuid" })
  questionId: string;

  @Column({ type: "uuid" })
  userId: string;

  @Column({ type: "enum", enum: ["Correct", "Incorrect"] })
  answerStatus: AnswersEnum;

  @Column({ type: "timestamp with time zone" })
  addedAt: Date;

  @ManyToOne(() => User, (u) => u.answers)
  user: User;
}
