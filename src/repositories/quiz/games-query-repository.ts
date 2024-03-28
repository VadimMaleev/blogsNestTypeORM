import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "./game.entity";
import { Repository } from "typeorm";
import { CreatedGameResponse } from "../../types/types";
import { QuizQuestions } from "./quiz.questions.entity";
import { mapGameForResponse } from "../../helpers/map.game.for.response";

@Injectable()
export class GamesQueryRepository {
  constructor(
    @InjectRepository(Game) protected gamesRepository: Repository<Game>,
    @InjectRepository(QuizQuestions)
    protected quizQuestionsRepository: Repository<QuizQuestions>
  ) {}

  async findGameById(gameId: string): Promise<CreatedGameResponse> {
    const game = await this.gamesRepository.findOneBy({ id: gameId });

    const questions = await this.quizQuestionsRepository
      .createQueryBuilder("qq")
      .where("qq.gameId = :gameId", { gameId: gameId })
      .leftJoinAndSelect("qq.question", "q")
      .select(["q.id", "q.body"])
      .getRawMany();

    const mappedQuestions = questions.map((q) => ({
      id: q.q_id,
      body: q.q_body,
    }));

    const answers = [];
    return mapGameForResponse(game, mappedQuestions, answers);
  }
}
