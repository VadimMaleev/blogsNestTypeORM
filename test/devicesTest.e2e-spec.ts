import { INestApplication } from "@nestjs/common";
import { agent as request } from "supertest";
import { startApp } from "./test.app.init";

describe("Test Devices e2e", () => {
  let app: INestApplication;

  let token = "";
  let refreshToken = "";
  let userId = "";

  const user = {
    login: "loginTEST",
    email: "testingbyme@gmail.com",
    password: "123TEST",
  };

  const loginUser = {
    loginOrEmail: "loginTEST",
    password: "123TEST",
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
  });

  describe("creating users and login users", () => {
    it("should creat new user", async () => {
      const response = await request(app.getHttpServer())
        .post("/sa/users")
        .send(user)
        .set(
          "Authorization",
          "Basic " + new Buffer("admin:qwerty").toString("base64")
        );
      userId = response.body.id;
      expect(response).toBeDefined();
      expect(response.status).toBe(201);
      expect(response.body.login).toBe(user.login);
      expect(response.body.email).toBe(user.email);
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
  });

  describe("get new pair of tokens", () => {
    it("should return new pair", async () => {
      const response = await request(app.getHttpServer())
        .post("/auth/refresh-token")
        .set("Cookie", refreshToken);
      expect(response.status).toBe(200);
    });
  });
});
