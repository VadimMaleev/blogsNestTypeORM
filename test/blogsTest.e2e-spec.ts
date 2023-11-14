import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import cookieParser from "cookie-parser";
import { agent as request } from "supertest";
import { uuid } from "uuidv4";
import { randomUUID } from "crypto";

describe("Test Blogs", () => {
  let app: INestApplication;

  let blogId = "";

  const invalidBlog = {
    name: "",
    description: "",
    websiteUrl: "",
  };

  const validBlog = {
    name: "vadim-jest",
    description: "valid description",
    websiteUrl: "https://youtube.com",
  };

  const updatedBlog = {
    name: "vadim-jest-upd",
    description: "description update",
    websiteUrl: "https://youtubenew.com",
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        stopAtFirstError: true,
        forbidUnknownValues: false,
        exceptionFactory: (errors) => {
          const errorsForResponse = [];
          errors.forEach((e) => {
            const keysConstraints = Object.keys(e.constraints);
            keysConstraints.forEach((ckey) => {
              errorsForResponse.push({
                message: e.constraints[ckey],
                field: e.property,
              });
            });
          });

          throw new BadRequestException(errorsForResponse);
        },
      })
    );
    await app.init();
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
      const response = await request(app.getHttpServer()).get("/blogs");

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.body.items).toStrictEqual([]);
    });
  });

  describe("create blog", () => {
    it("should return error 401 if no BasicAuth", async () => {
      const response = await request(app.getHttpServer())
        .post("/sa/blogs")
        .send(validBlog);
      expect(response).toBeDefined();
      expect(response.status).toBe(401);
    });

    it("should return errors array because blog not valid", async () => {
      const response = await request(app.getHttpServer())
        .post("/sa/blogs")
        .send(invalidBlog)
        .set(
          "Authorization",
          "Basic " + new Buffer("admin:qwerty").toString("base64")
        );

      expect(response).toBeDefined();
      expect(response.status).toBe(400);
    });

    it("should return new blog", async () => {
      const response = await request(app.getHttpServer())
        .post("/sa/blogs")
        .send(validBlog)
        .set(
          "Authorization",
          "Basic " + new Buffer("admin:qwerty").toString("base64")
        );

      blogId = response.body.id;
      expect(response).toBeDefined();
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(validBlog.name);
      expect(response.body.websiteUrl).toBe(validBlog.websiteUrl);
      expect(response.body.description).toBe(validBlog.description);
    });
  });

  describe("read created blog", () => {
    it("should return blogs", async () => {
      const response = await request(app.getHttpServer()).get("/blogs");
      expect(response).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.body.pagesCount).toBe(1);
      expect(response.body.page).toBe(1);
      expect(response.body.totalCount).toBe(1);
      expect(response.body.items[0].name).toBe(validBlog.name);
      expect(response.body.items[0].description).toBe(validBlog.description);
      expect(response.body.items[0].websiteUrl).toBe(validBlog.websiteUrl);
    });

    it("should return 404", async () => {
      const response = await request(app.getHttpServer()).get(
        `/blogs/${uuid()}`
      );

      expect(response).toBeDefined();
      expect(response.status).toBe(404);
    });

    it("should return blog", async () => {
      const response = await request(app.getHttpServer()).get(
        `/blogs/${blogId}`
      );

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(validBlog.name);
      expect(response.body.description).toBe(validBlog.description);
      expect(response.body.websiteUrl).toBe(validBlog.websiteUrl);
    });
  });

  describe("update blog", () => {
    it("should return 401 error Unauthorized", async () => {
      const response = await request(app.getHttpServer()).put(
        `/sa/blogs/${blogId}`
      );

      expect(response).toBeDefined();
      expect(response.status).toBe(401);
    });

    it("should return error 404 if param not valid", async () => {
      const response = await request(app.getHttpServer())
        .put(`/sa/blogs/${randomUUID()}`)
        .send(updatedBlog)
        .set(
          "Authorization",
          "Basic " + new Buffer("admin:qwerty").toString("base64")
        );

      expect(response).toBeDefined();
      expect(response.status).toBe(404);
    });

    it("should return status 204", async () => {
      const response = await request(app.getHttpServer())
        .put(`/sa/blogs/${blogId}`)
        .send(updatedBlog)
        .set(
          "Authorization",
          "Basic " + new Buffer("admin:qwerty").toString("base64")
        );

      expect(response).toBeDefined();
      expect(response.status).toBe(204);
    });

    it("should return updated blog", async () => {
      const response = await request(app.getHttpServer()).get(
        `/blogs/${blogId}`
      );

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedBlog.name);
      expect(response.body.description).toBe(updatedBlog.description);
      expect(response.body.websiteUrl).toBe(updatedBlog.websiteUrl);
    });
  });

  describe("delete blog", () => {
    it("should return 401 no BasicAuth", async () => {
      const response = await request(app.getHttpServer()).delete(
        `/sa/blogs/${blogId}`
      );

      expect(response).toBeDefined();
      expect(response.status).toBe(401);
    });

    it("should return error 404 if param not valid", async () => {
      const response = await request(app.getHttpServer())
        .delete(`/sa/blogs/${uuid()}`)
        .set(
          "Authorization",
          "Basic " + new Buffer("admin:qwerty").toString("base64")
        );

      expect(response).toBeDefined();
      expect(response.status).toBe(404);
    });

    it("should return 204 status", async () => {
      const response = await request(app.getHttpServer())
        .delete(`/sa/blogs/${blogId}`)
        .set(
          "Authorization",
          "Basic " + new Buffer("admin:qwerty").toString("base64")
        );

      expect(response).toBeDefined();
      expect(response.status).toBe(204);
    });

    it("should return 404 after deleting blog", async () => {
      const response = await request(app.getHttpServer()).get(
        `/blogs/${blogId}`
      );

      expect(response).toBeDefined();
      expect(response.status).toBe(404);
    });
  });
});
