import { Injectable } from "@nestjs/common";
import { RecoveryCodeDto } from "../../types/dto";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class RecoveryCodeRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createRecoveryCode(recoveryCode: RecoveryCodeDto) {
    await this.dataSource.query(
      `
        INSERT INTO public."RecoveryCodes"(
        "code", "codeExpirationDate", "userId")
        VALUES ($1, $2, $3);`,
      [recoveryCode.code, recoveryCode.codeExpirationDate, recoveryCode.userId]
    );
  }

  async findCode(recoveryCode: string) {
    const code = await this.dataSource.query(
      `
      SELECT "code", "codeExpirationDate", "userId"
      FROM public."RecoveryCodes";
      WHERE "code" = $1
    `,
      [recoveryCode]
    );
    return code[0];
  }

  async deleteCode(recoveryCode: string) {
    await this.dataSource.query(
      `
        DELETE FROM public."RecoveryCodes"
        WHERE "code" = $1;
    `,
      [recoveryCode]
    );
    return true;
  }
}
