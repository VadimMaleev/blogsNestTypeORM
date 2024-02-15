import { Column, Entity, PrimaryColumn } from "typeorm";
import { GameStatusEnum } from "../../types/types";

@Entity("Game")
export class Game {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "uuid" })
  firstPlayerId: string;

  @Column({ type: "uuid", nullable: true })
  secondPlayerId: string;

  @Column({ default: 0 })
  firstPlayerScore: number;

  @Column({ default: 0 })
  secondPlayerScore: number;

  @Column({ type: "enum", enum: ["PendingSecondPlayer", "Active", "Finished"] })
  status: GameStatusEnum;

  @Column({ type: "timestamp with time zone" })
  pairCreatedDate: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  startGameDate: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  finishGameDate: Date;
}

//вспом таблица вопросов

//игроков к юзерам
