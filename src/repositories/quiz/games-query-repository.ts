import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "./game.entity";
import { Repository } from "typeorm";
import { CreatedGameResponse, GameStatusEnum } from "../../types/types";

import { mapGameForResponse } from "../../helpers/map.game.for.response";
import { QuizQuestionsRepository } from "./quiz.questions.repository";

@Injectable()
export class GamesQueryRepository {
  constructor(
    @InjectRepository(Game) protected gamesRepository: Repository<Game>,
    protected quizQuestionsRepository: QuizQuestionsRepository
  ) {}

  async findGameById(gameId: string): Promise<CreatedGameResponse> {
    const game = await this.gamesRepository.findOneBy({ id: gameId });
    if (!game) return null;

    const questions = await this.quizQuestionsRepository.getQuestions(gameId);

    const answers = [];
    return mapGameForResponse(game, questions, answers);
  }

  async findActiveGameForUser(userId: string) {
    const game = await this.gamesRepository
      .createQueryBuilder("g")
      .select("*")
      .where("(g.firstPlayerId = :playerId OR g.secondPlayerId = :playerId)", {
        playerId: userId,
      })
      .andWhere("(g.status = :status1 OR g.status = :status2)", {
        status1: GameStatusEnum.PendingSecondPlayer,
        status2: GameStatusEnum.Active,
      })
      .getRawOne();
    if (!game) return null;

    const gameId = game.id;

    const questions = await this.quizQuestionsRepository.getQuestions(gameId);

    const answers = [];
    return mapGameForResponse(game, questions, answers);
  }
}
