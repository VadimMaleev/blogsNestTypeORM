import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class JwtRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async expireRefreshToken(refreshToken: string) {
    await this.dataSource.query(
      `
        INSERT INTO public."Tokens"(
        "refreshToken")
        VALUES ($1);
      `,
      [refreshToken]
    );
  }
  async findAllExpiredTokens(token: string) {
    const refreshToken = await this.dataSource.query(
      `
        SELECT id, "refreshToken"
        FROM public."Tokens"
        WHERE "refreshToken" = $1
        `,
      [token]
    );
    return refreshToken[0];
  }
}
