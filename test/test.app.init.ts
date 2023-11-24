import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import cookieParser from "cookie-parser";
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from "@nestjs/common";

export const startApp = async () => {
  let app: INestApplication;
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

  return app;
};
