import { INestApplication } from "@nestjs/common";
import { startApp } from "./test.app.init";
import { agent as request } from "supertest";

describe("Quiz Game e2e tests", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await startApp();
  });

  afterAll(async () => {
    await app.close();
  });

  const user = {
    login: "loginTEST",
    email: "testingbyme@gmail.com",
    password: "123TEST",
  };

  const loginUser = {
    loginOrEmail: "loginTEST",
    password: "123TEST",
  };

  const user2 = {
    login: "login2TEST",
    email: "testingbymee@gmail.com",
    password: "123TEST",
  };

  const loginUser2 = {
    loginOrEmail: "login2TEST",
    password: "123TEST",
  };

  let userId = "";
  let userId2 = "";
  let token = "";
  let token2 = "";
  let refreshToken = "";
  let refreshToken2 = "";

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

  describe("creating and login 2 users", () => {
    it("should creat new user", async () => {
      const response = await request(app.getHttpServer())
        .post("/sa/users")
        .send(user)
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      userId = response.body.id;
      expect(response).toBeDefined();
      expect(response.status).toBe(201);
      expect(response.body.login).toBe(user.login);
      expect(response.body.email).toBe(user.email);
    });

    it("should creat new user 2", async () => {
      const response = await request(app.getHttpServer())
        .post("/sa/users")
        .send(user2)
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      userId2 = response.body.id;
      expect(response).toBeDefined();
      expect(response.status).toBe(201);
      expect(response.body.login).toBe(user2.login);
      expect(response.body.email).toBe(user2.email);
    });

    describe("login user", () => {
      it("login - should return 200 status", async () => {
        const response = await request(app.getHttpServer())
          .post("/auth/login")
          .send(loginUser)
          .set("user-agent", "test");
        token = response.body.accessToken;
        refreshToken = response.headers["set-cookie"];
        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
      });
    });

    describe("login user2", () => {
      it("login - should return 200 status", async () => {
        const response = await request(app.getHttpServer())
          .post("/auth/login")
          .send(loginUser2)
          .set("user-agent", "test");
        token2 = response.body.accessToken;
        refreshToken2 = response.headers["set-cookie"];
        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
      });
    });
  });

  describe("creating questions", () => {
    it("should create and publish questions", async () => {
      await createAndSaveQuestionsInDBAndPublish(10);
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
        .set("Authorization", "Bearer " + token);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(pendingGameStab);
      expect(res.body.firstPlayerProgress.player).toEqual({
        id: userId,
        login: user.login,
      });
      expect(res.body.firstPlayerProgress.score).toBe(0);
      expect(res.body.status).toBe("PendingSecondPlayer");
    });
  });

  describe("should add second player and start game", () => {
    it("should return active game with questions", async () => {
      const res = await request(app.getHttpServer())
        .post("/pair-game-quiz/pairs/connection")
        .set("Authorization", "Bearer " + token2);
      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(activeGameStab);
      expect(res.body.firstPlayerProgress.player).toEqual({
        id: userId,
        login: user.login,
      });
      expect(res.body.secondPlayerProgress.player).toEqual({
        id: userId2,
        login: user2.login,
      });
      expect(res.body.firstPlayerProgress.score).toBe(0);
      expect(res.body.secondPlayerProgress.score).toBe(0);
      expect(res.body.questions.length).toBe(5);
      expect(res.body.status).toBe("Active");
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
});
