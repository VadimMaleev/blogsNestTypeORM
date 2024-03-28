import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../../guards/jwt.auth.guard";
import { PairQuizGameService } from "../../../application/services/pair.quiz.game.service";
import { CreatedGameResponse } from "../../../types/types";
import { GamesQueryRepository } from "../../../repositories/quiz/games-query-repository";

@Controller("/pair-game-quiz")
export class PairGameQuizController {
  constructor(
    protected pairGameQuizService: PairQuizGameService,
    protected gamesQueryRepository: GamesQueryRepository
  ) {}

  @Get("pairs/:id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getGameById(
    @Param("id") id: string,
    @Request() req
  ): Promise<CreatedGameResponse> {
    const game = await this.gamesQueryRepository.findGameById(id);
    if (!game) throw new NotFoundException("Game Not Found");
    if (
      game.firstPlayerProgress.player.id !== req.user.id ||
      game.secondPlayerProgress.player.id !== req.user.id
    )
      throw new HttpException("Not Your own", 403);
    return game;
  }

  @Post("pairs/connection")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async connectToNewGame(@Request() req): Promise<CreatedGameResponse> {
    const gameId: string =
      await this.pairGameQuizService.createNewPairOrStartGame(req.user);
    return this.gamesQueryRepository.findGameById(gameId);
  }
}
