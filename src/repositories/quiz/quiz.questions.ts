import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("QuizQuestions")
export class QuizQuestions {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  gameId: string;

  @Column({ type: "uuid" })
  questionId: string;
}
