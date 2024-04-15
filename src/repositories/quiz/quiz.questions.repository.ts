import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuizQuestions } from "./quiz.questions.entity";
import { Repository } from "typeorm";

@Injectable()
export class QuizQuestionsRepository {
  constructor(
    @InjectRepository(QuizQuestions)
    protected quizQuestionsRepository: Repository<QuizQuestions>
  ) {}

  async addQuestions(
    questions: { id: string; body: string }[],
    gameId: string
  ) {
    const questionsArray = questions.map((q) => ({ gameId, questionId: q.id }));
    await this.quizQuestionsRepository.save(questionsArray);
  }

  async getQuestions(gameId: string) {
    return this.quizQuestionsRepository
      .createQueryBuilder("qq")
      .where("qq.gameId = :gameId", { gameId: gameId })
      .leftJoinAndSelect("qq.question", "q")
      .select(["q.id", "q.body"])
      .orderBy("q.id")
      .getRawMany();
  }
}
