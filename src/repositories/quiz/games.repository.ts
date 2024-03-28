import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "./game.entity";
import { Brackets, Repository } from "typeorm";
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
      .where(
        new Brackets((qb) =>
          qb
            .where("g.firstPlayerId = :userId", { userId: userId })
            .orWhere("g.secondPlayerId = :userId", { userId: userId })
        )
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where("g.status = :st", { st: GameStatusEnum.PendingSecondPlayer })
            .orWhere("g.status = :st", { st: GameStatusEnum.Active })
        )
      )
      .getOne();
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
