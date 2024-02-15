import { Controller, Delete, HttpCode } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Controller("testing")
export class TestingController {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  @Delete("all-data")
  @HttpCode(204)
  async deleteAll() {
    await this.dataSource.query(
      `
      DELETE FROM public."Device";
      DELETE FROM public."RecoveryCode";
      DELETE FROM public."Tokens";
      DELETE FROM public."LikeForComment";
      DELETE FROM public."LikeForPost";
      DELETE FROM public."Comment";
      DELETE FROM public."User";
      DELETE FROM public."Post";
      DELETE FROM public."Blog";
      DELETE FROM public."BannedUsersForBlogs";
      DELETE FROM public."Likes";
      DELETE FROM public."Question";
      DELETE FROM public."Game";
      DELETE FROM public."QuizQuestions";
      DELETE FROM public."Answer";
      `
    );
    return true;
  }
}
