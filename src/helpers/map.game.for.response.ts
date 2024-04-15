import { CreatedGameResponse } from "../types/types";

export const mapGameForResponse = (
  game,
  questions,
  answers
): CreatedGameResponse => ({
  id: game.id,
  firstPlayerProgress: {
    answers: answers,
    player: {
      id: game.firstPlayerId,
      login: game.firstPlayerLogin,
    },
    score: game.firstPlayerScore,
  },
  secondPlayerProgress: {
    answers: answers,
    player: {
      id: game.secondPlayerId,
      login: game.secondPlayerLogin,
    },
    score: game.secondPlayerScore,
  },
  questions: questions.map((q) => ({
    id: q.q_id,
    body: q.q_body,
  })),
  status: game.status,
  pairCreatedDate: game.pairCreatedDate,
  startGameDate: game.startGameDate,
  finishGameDate: game.finishGameDate,
});
