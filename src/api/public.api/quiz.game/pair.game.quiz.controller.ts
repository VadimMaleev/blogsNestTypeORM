import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../../guards/jwt.auth.guard";
import { PairQuizGameService } from "../../../application/services/pair.quiz.game.service";
import { CreatedGameResponse } from "../../../types/types";
import { GamesQueryRepository } from "../../../repositories/quiz/games-query-repository";

@Controller("pair-game-quiz")
export class PairGameQuizController {
  constructor(
    protected pairGameQuizService: PairQuizGameService,
    protected gamesQueryRepository: GamesQueryRepository
  ) {}

  @Get("pairs/my-current")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getMyCurrentGame(@Request() req) {
    const game = await this.gamesQueryRepository.findActiveGameForUser(
      req.user.id
    );
    if (!game) throw new NotFoundException();
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

  @Post("pairs/my-current/answers")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async sendAnswer(@Request() req) {}

  @Get("pairs/:id")
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getGameById(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Request() req
  ): Promise<CreatedGameResponse> {
    //TODO Bad Request response to SWAGGER
    const game = await this.gamesQueryRepository.findGameById(id);
    if (!game) throw new NotFoundException("Game Not Found");

    if (
      game.firstPlayerProgress.player.id === req.user.id ||
      game.secondPlayerProgress.player.id === req.user.id
    )
      return game;

    throw new ForbiddenException("Not Your own");
  }
}
