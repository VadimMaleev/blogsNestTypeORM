import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { agent as request } from "supertest";
import { AppModule } from "../src/app.module";

describe("Test Devices", () => {
  let app: INestApplication;

  let token = "";
  let token2 = "";
  let userId = "";
  let userId2 = "";

  const user = {
    login: "loginTEST",
    email: "testingbyme@gmail.com",
    password: "123TEST",
  };

  const user2 = {
    login: "login222TEST",
    email: "testing222byme@gmail.com",
    password: "123TEST",
  };

  const loginUser = {
    loginOrEmail: "loginTEST",
    password: "123TEST",
  };

  const loginUser2 = {
    loginOrEmail: "login222TEST",
    password: "123TEST",
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("creating users and login users", () => {
    it("delete all data", async () => {
      const response = await request(app.getHttpServer()).delete(
        "/testing/all-data"
      );
      expect(response.status).toBe(204);
    });

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

    it("should creat new user2", async () => {
      const response = await request(app.getHttpServer())
        .post("/sa/users")
        .send(user2)
        .set(
          "Authorization",
          "Basic " + new Buffer("admin:qwerty").toString("base64")
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
        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
      });
    });
  });
});
