import { INestApplication } from "@nestjs/common";
import { startApp } from "./test.app.init";
import { agent as request } from "supertest";
import { randomUUID } from "crypto";

describe("Quiz Game e2e tests", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await startApp();
  });

  afterAll(async () => {
    await app.close();
  });

  let gameId = "";
  let users = [];

  const user2 = {
    login: "loginTEST",
    email: "testing222byme@gmail.com",
    password: "123TEST",
  };

  const pendingGameStab = {
    id: expect.any(String),
    firstPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: expect.any(String),
        login: expect.any(String),
      },
      score: expect.any(Number),
    },
    secondPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: null,
        login: null,
      },
      score: expect.any(Number),
    },
    questions: expect.any(Array),
    status: expect.any(String),
    pairCreatedDate: expect.any(String),
    startGameDate: null,
    finishGameDate: null,
  };

  const activeGameStab = {
    id: expect.any(String),
    firstPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: expect.any(String),
        login: expect.any(String),
      },
      score: expect.any(Number),
    },
    secondPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: expect.any(String),
        login: expect.any(String),
      },
      score: expect.any(Number),
    },
    questions: expect.any(Array),
    status: expect.any(String),
    pairCreatedDate: expect.any(String),
    startGameDate: expect.any(String),
    finishGameDate: null,
  };

  describe("delete all data", () => {
    it("delete all data in DB", async () => {
      const response = await request(app.getHttpServer()).delete(
        "/testing/all-data"
      );
      expect(response.status).toBe(204);
    });
  });

  describe("creating and login users", () => {
    it("should create several users", async function () {
      users = await createAndLoginSeveralUsers(3);
    });
  });

  describe("creating questions", () => {
    it("should create and publish questions", async () => {
      await createAndSaveQuestionsInDBAndPublish(5);
    });
  });

  describe("should create new Pending Pair Game", () => {
    it("should return error 401", async () => {
      const res = await request(app.getHttpServer()).post(
        "/pair-game-quiz/pairs/connection"
      );
      expect(res.status).toBe(401);
    });

    it("should return new pending game", async () => {
      const res = await request(app.getHttpServer())
        .post("/pair-game-quiz/pairs/connection")
        .set("Authorization", "Bearer " + users[0].accessToken);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(pendingGameStab);
      expect(res.body.firstPlayerProgress.player).toEqual({
        id: users[0].userId,
        login: users[0].login,
      });
      expect(res.body.firstPlayerProgress.score).toBe(0);
      expect(res.body.status).toBe("PendingSecondPlayer");
      gameId = res.body.id;
    });

    it("should return Error403 because player already in game", async function () {
      const res = await request(app.getHttpServer())
        .post("/pair-game-quiz/pairs/connection")
        .set("Authorization", "Bearer " + users[0].accessToken);
      expect(res.status).toBe(403);
    });
  });

  describe("check current game by user", () => {
    it("should return current game", async function () {
      const res = await request(app.getHttpServer())
        .get("/pair-game-quiz/pairs/my-current")
        .set("Authorization", "Bearer " + users[0].accessToken);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(pendingGameStab);
    });
  });

  describe("should add second player and start game", () => {
    it("should return active game with questions", async () => {
      const res = await request(app.getHttpServer())
        .post("/pair-game-quiz/pairs/connection")
        .set("Authorization", "Bearer " + users[1].accessToken);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(activeGameStab);
      expect(res.body.firstPlayerProgress.player).toEqual({
        id: users[0].userId,
        login: users[0].login,
      });
      expect(res.body.secondPlayerProgress.player).toEqual({
        id: users[1].userId,
        login: users[1].login,
      });
      expect(res.body.firstPlayerProgress.score).toBe(0);
      expect(res.body.secondPlayerProgress.score).toBe(0);
      expect(res.body.questions.length).toBe(5);
      expect(res.body.status).toBe("Active");
    });
  });

  describe("check get game by ID", () => {
    it("should return 401 error", async () => {
      const res = await request(app.getHttpServer()).get(
        `/pair-game-quiz/pairs/${gameId}`
      );
      expect(res.status).toBe(401);
    });

    it("should return 400 error", async () => {
      const res = await request(app.getHttpServer())
        .get(`/pair-game-quiz/pairs/${1}`)
        .set("Authorization", "Bearer " + users[1].accessToken);
      console.log(res.body);
      expect(res.status).toBe(400);
    });

    it("should return 404 error", async function () {
      const res = await request(app.getHttpServer())
        .get(`/pair-game-quiz/pairs/${randomUUID()}`)
        .set("Authorization", "Bearer " + users[1].accessToken);
      expect(res.status).toBe(404);
    });

    it("should return 403 Error", async function () {
      const res = await request(app.getHttpServer())
        .get(`/pair-game-quiz/pairs/${gameId}`)
        .set("Authorization", "Bearer " + users[2].accessToken);
      expect(res.status).toBe(403);
    });

    it("should return game", async function () {
      const res = await request(app.getHttpServer())
        .get(`/pair-game-quiz/pairs/${gameId}`)
        .set("Authorization", "Bearer " + users[0].accessToken);
      expect(res.body).toEqual(activeGameStab);
      expect(res.body.firstPlayerProgress.player).toEqual({
        id: users[0].userId,
        login: users[0].login,
      });
      expect(res.body.status).toBe("Active");
      expect(res.status).toBe(200);
    });
  });

  const createAndSaveQuestionsInDBAndPublish = async (count: number) => {
    const questionsId = [];
    for (let i = 0; i < count; i++) {
      const res = await request(app.getHttpServer())
        .post("/sa/quiz/questions")
        .send({
          body: `valid question test ${i}`,
          correctAnswers: ["hello", "world"],
        })
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      questionsId.push(res.body.id);

      for (const id of questionsId) {
        await request(app.getHttpServer())
          .put(`/sa/quiz/questions/${id}/publish`)
          .send({ published: true })
          .set(
            "Authorization",
            "Basic " + Buffer.from("admin:qwerty").toString("base64")
          );
      }
    }
    return;
  };

  const createAndLoginSeveralUsers = async (
    count: number
  ): Promise<{ accessToken: string; userId: string }[]> => {
    const users = [];
    for (let i = 0; i < count; i++) {
      const user = await request(app.getHttpServer())
        .post("/sa/users")
        .send({
          ...user2,
          login: user2.login + i,
          email: `email@emai${i}l.com`,
        })
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      users.push(user.body);
    }
    const tokens = [];

    for (const user of users) {
      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({ loginOrEmail: user.login, password: user2.password })
        .set("user-agent", "test");
      tokens.push({
        accessToken: response.body.accessToken,
        userId: user.id,
        login: user.login,
      });
    }
    return tokens;
  };
});
