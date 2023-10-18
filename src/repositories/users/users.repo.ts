import { CreateUserDto } from "../../types/dto";
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(User)
    protected usersRepository: Repository<User>
  ) {}

  async createUser(newUser: CreateUserDto) {
    return this.usersRepository.save(newUser);
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.usersRepository.delete({ id: id });
    return true;
  }

  async updateConfirmation(id: string) {
    await this.usersRepository.update({ id: id }, { isConfirmed: true });
    return true;
  }

  async updateConfirmCode(
    userId: string,
    confirmCode: string,
    expirationDate: Date
  ) {
    await this.usersRepository.update(
      { id: userId },
      { confirmationCode: confirmCode, codeExpirationDate: expirationDate }
    );
    return true;
  }

  async updatePassword(
    newPasswordHash: string,
    userId: string
  ): Promise<boolean> {
    await this.usersRepository.update(
      { id: userId },
      { passwordHash: newPasswordHash }
    );
    return true;
  }

  async updateBanStatus(
    userId: string,
    banStatus: boolean,
    banReason: string | null,
    banDate: Date | null
  ) {
    await this.usersRepository.update(
      { id: userId },
      { isBanned: banStatus, banReason: banReason, banDate: banDate }
    );
    return true;
  }

  async findUserById(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }
}
