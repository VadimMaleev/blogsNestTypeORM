import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "../../repositories/users/user.entity";
import { GameStatusEnum } from "../../types/types";
import { CreateGameDto } from "../../types/dto";
import { v4 as uuidv4 } from "uuid";
import { GamesRepository } from "../../repositories/quiz/games.repository";
import { QuestionsQueryRepository } from "../../repositories/questions/questions.query.repository";
import { QuizQuestionsRepository } from "../../repositories/quiz/quiz.questions.repository";

@Injectable()
export class PairQuizGameService {
  constructor(
    protected gamesRepository: GamesRepository,
    protected questionsQueryRepository: QuestionsQueryRepository,
    protected quizQuestionsRepository: QuizQuestionsRepository
  ) {}
  async createNewPairOrStartGame(user: User): Promise<string> {
    const activeOrPendingGameByUser =
      await this.gamesRepository.checkActiveOrPendingGameByUser(user.id);
    if (activeOrPendingGameByUser)
      throw new HttpException("You ready for Game", 403);

    const pendingGame = await this.gamesRepository.checkPendingGame();
    if (pendingGame) {
      await this.gamesRepository.addSecondPlayerAndStartGame(
        user,
        pendingGame.id
      );
      const questionsForGame =
        await this.questionsQueryRepository.getFiveRandomQuestionsForGame();
      if (!questionsForGame.length)
        throw new NotFoundException("Questions Not found");
      await this.quizQuestionsRepository.addQuestions(
        questionsForGame,
        pendingGame.id
      );

      return pendingGame.id;
    } else {
      const newGame = new CreateGameDto(
        uuidv4(),
        user.id,
        null,
        0,
        0,
        user.login,
        null,
        GameStatusEnum.PendingSecondPlayer,
        new Date(),
        null,
        null
      );

      await this.gamesRepository.createNewGame(newGame);
      return newGame.id;
    }
  }
}
