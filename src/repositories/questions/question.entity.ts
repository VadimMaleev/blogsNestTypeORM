import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { QuizQuestions } from "../quiz/quiz.questions.entity";

@Entity("Question")
export class Question {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column()
  body: string;

  @Column({ type: "jsonb", nullable: true })
  correctAnswers: string[];

  @Column()
  published: boolean;

  @Column({ type: "timestamp with time zone" })
  createdAt: Date;

  @Column({ type: "timestamp with time zone" })
  updatedAt: Date;

  @OneToMany(() => QuizQuestions, (qq) => qq.question)
  quizQuestions: QuizQuestions[];
}
