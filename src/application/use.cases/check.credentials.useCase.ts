import * as bcrypt from "bcrypt";
import { CommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../repositories/users/users.repo";

export class CheckCredentialsCommand {
  constructor(public loginOrEmail: string, public password: string) {}
}

@CommandHandler(CheckCredentialsCommand)
export class CheckCredentialsUseCase {
  constructor(protected usersRepository: UsersRepository) {}

  async execute(command: CheckCredentialsCommand) {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      command.loginOrEmail
    );
    if (!user) return null;
    const isCompare = await bcrypt.compare(command.password, user.passwordHash);
    return isCompare ? user : null;
  }
}
