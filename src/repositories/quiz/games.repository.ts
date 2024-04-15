import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "./game.entity";
import { Repository } from "typeorm";
import { CreateGameDto } from "../../types/dto";
import { GameStatusEnum } from "../../types/types";
import { User } from "../users/user.entity";

@Injectable()
export class GamesRepository {
  constructor(
    @InjectRepository(Game) protected gamesRepository: Repository<Game>
  ) {}

  async createNewGame(game: CreateGameDto) {
    return this.gamesRepository.save(game);
  }

  async checkPendingGame(): Promise<Game> {
    return this.gamesRepository.findOneBy({
      status: GameStatusEnum.PendingSecondPlayer,
    });
  }

  async checkActiveOrPendingGameByUser(userId): Promise<Game> {
    return this.gamesRepository
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
  }

  async addSecondPlayerAndStartGame(
    user: User,
    gameId: string
  ): Promise<boolean> {
    await this.gamesRepository.update(
      { id: gameId },
      {
        secondPlayerId: user.id,
        secondPlayerLogin: user.login,
        status: GameStatusEnum.Active,
        startGameDate: new Date(),
      }
    );
    return true;
  }
}
