import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Game } from "./game.entity";
import { Question } from "../questions/question.entity";

@Entity("QuizQuestions")
export class QuizQuestions {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  gameId: string;

  @Column({ type: "uuid" })
  questionId: string;

  @ManyToOne(() => Game, (q) => q.questions)
  game: Game;

  @ManyToOne(() => Question, (q) => q.quizQuestions)
  question: Question;
}
