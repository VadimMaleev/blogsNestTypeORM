import { INestApplication } from "@nestjs/common";
import { startApp } from "./test.app.init";
import { agent as request } from "supertest";
import { randomUUID } from "crypto";

describe("Questions Tests", () => {
  let app: INestApplication;

  let questionId = "";

  const invalidBodyQuestion = {
    body: "",
    correctAnswers: ["hello", "world"],
  };

  const invalidAnswersQuestions = {
    body: "valid question test",
    correctAnswers: [2],
  };

  const validQuestion = {
    body: "valid question test",
    correctAnswers: ["hello", "world"],
  };
  const updatedValidQuestion = {
    body: "UPDATED valid question test",
    correctAnswers: ["UPDAETED", "hello", "world"],
  };

  beforeAll(async () => {
    app = await startApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("delete all data", () => {
    it("delete all data in DB", async () => {
      const response = await request(app.getHttpServer()).delete(
        "/testing/all-data"
      );
      expect(response.status).toBe(204);
    });

    it("should return empty array", async () => {
      const response = await request(app.getHttpServer())
        .get("/sa/quiz/questions")
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(response).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.body.items).toStrictEqual([]);
    });
  });
  describe("create question after check", () => {
    it("should return 401 error", async function () {
      const res = await request(app.getHttpServer())
        .post("/sa/quiz/questions")
        .send(validQuestion);
      expect(res.status).toBe(401);
    });

    it("should return error - body invalid", async () => {
      const res = await request(app.getHttpServer())
        .post("/sa/quiz/questions")
        .send(invalidBodyQuestion)
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(res).toBeDefined();
      expect(res.status).toBe(400);
    });

    it("should return error 400 - answers invalid", async function () {
      const res = await request(app.getHttpServer())
        .post("/sa/quiz/questions")
        .send(invalidAnswersQuestions)
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(res).toBeDefined();
      expect(res.status).toBe(400);
    });

    it("should create new question and return him", async function () {
      const res = await request(app.getHttpServer())
        .post("/sa/quiz/questions")
        .send(validQuestion)
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      questionId = res.body.id;
      expect(res).toBeDefined();
      expect(res.status).toBe(201);
      expect(res.body.body).toBe(validQuestion.body);
      expect(res.body.correctAnswers).toStrictEqual(
        validQuestion.correctAnswers
      );
    });
  });
  describe("get created question with pagination", () => {
    it("should return 401 error", async function () {
      const res = await request(app.getHttpServer()).get("/sa/quiz/questions");
      expect(res.status).toBe(401);
    });

    it("should return created question", async function () {
      const res = await request(app.getHttpServer())
        .get("/sa/quiz/questions")
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(res.status).toBe(200);
      expect(res.body.pagesCount).toBe(1);
      expect(res.body.page).toBe(1);
      expect(res.body.totalCount).toBe(1);
      expect(res.body.items[0].body).toBe(validQuestion.body);
      expect(res.body.items[0].correctAnswers).toStrictEqual(
        validQuestion.correctAnswers
      );
      expect(res.body.items[0].published).toBeFalsy();
    });
  });
  describe("update publish status question", () => {
    it("should return 401 Error", async function () {
      const res = await request(app.getHttpServer()).put(
        `/sa/quiz/questions/${questionId}/publish`
      );
      expect(res.status).toBe(401);
    });

    it("should update publish status", async function () {
      const res = await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questionId}/publish`)
        .send({ published: true })
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(res).toBeDefined();
    });

    it("should return updated publish status question", async function () {
      const res = await request(app.getHttpServer())
        .get("/sa/quiz/questions")
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(res.status).toBe(200);
      expect(res.body.items[0].published).toBeTruthy();
    });
  });
  describe("update question", () => {
    it("should return 401 Error", async function () {
      const res = await request(app.getHttpServer()).put(
        `/sa/quiz/questions/${questionId}`
      );
      expect(res.status).toBe(401);
    });

    it("should return 404 Error", async function () {
      const res = await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${randomUUID()}`)
        .send(updatedValidQuestion)
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(res.status).toBe(404);
    });

    it("should return 400 Error because inputModel is INCORRECT", async function () {
      const res = await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questionId}`)
        .send(invalidBodyQuestion)
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(res.status).toBe(400);
    });

    it("should return 400 Error because question was published", async function () {
      const res = await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questionId}`)
        .send(updatedValidQuestion)
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Question was published");
    });

    it("should unpublish question status", async function () {
      const res = await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questionId}/publish`)
        .send({ published: false })
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(res).toBeDefined();
    });

    it("should update question", async function () {
      const res = await request(app.getHttpServer())
        .put(`/sa/quiz/questions/${questionId}`)
        .send(updatedValidQuestion)
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(res.status).toBe(204);
    });

    it("should return updated question", async function () {
      const res = await request(app.getHttpServer())
        .get("/sa/quiz/questions")
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(res.status).toBe(200);
      expect(res.body.pagesCount).toBe(1);
      expect(res.body.page).toBe(1);
      expect(res.body.totalCount).toBe(1);
      expect(res.body.items[0].body).toBe(updatedValidQuestion.body);
      expect(res.body.items[0].correctAnswers).toStrictEqual(
        updatedValidQuestion.correctAnswers
      );
      expect(res.body.items[0].published).toBeFalsy();
    });
  });
  describe("delete question", () => {
    it("should return 401 error", async function () {
      const res = await request(app.getHttpServer()).delete(
        `/sa/quiz/questions/${questionId}`
      );
      expect(res.status).toBe(401);
    });

    it("should return 404 error", async function () {
      const res = await request(app.getHttpServer())
        .delete(`/sa/quiz/questions/${randomUUID()}`)
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(res.status).toBe(404);
    });

    it("should delete question", async function () {
      const res = await request(app.getHttpServer())
        .delete(`/sa/quiz/questions/${questionId}`)
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(res.status).toBe(204);
    });

    it("should return empty array of question", async function () {
      const res = await request(app.getHttpServer())
        .get("/sa/quiz/questions")
        .set(
          "Authorization",
          "Basic " + Buffer.from("admin:qwerty").toString("base64")
        );
      expect(res.status).toBe(200);
      expect(res.body.page).toBe(1);
      expect(res.body.totalCount).toBe(0);
    });
  });
});
