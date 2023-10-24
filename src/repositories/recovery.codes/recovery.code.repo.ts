import { Injectable } from "@nestjs/common";
import { RecoveryCodeDto } from "../../types/dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RecoveryCode } from "./recovery.code.entity";

@Injectable()
export class RecoveryCodeRepository {
  constructor(
    @InjectRepository(RecoveryCode)
    protected recoveryCodeRepository: Repository<RecoveryCode>
  ) {}

  async createRecoveryCode(recoveryCode: RecoveryCodeDto) {
    return await this.recoveryCodeRepository.save(recoveryCode);
  }

  async findCode(recoveryCode: string): Promise<RecoveryCode> {
    return await this.recoveryCodeRepository.findOneBy({ code: recoveryCode });
  }

  async deleteCode(recoveryCode: string) {
    await this.recoveryCodeRepository.delete({ code: recoveryCode });
    return true;
  }
}
