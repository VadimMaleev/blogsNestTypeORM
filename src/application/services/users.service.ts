import { UserCreateInputModelType } from "../../types/input.models";
import { v4 as uuidv4 } from "uuid";
import add from "date-fns/add";
import { UsersRepository } from "../../repositories/users/users.repo";
import { BannedUserForBlogDto, CreateUserDto } from "../../types/dto";
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UsersForResponse } from "../../types/types";
import { EmailAdapter } from "../../adapters/email-adapter";
import { DevicesRepository } from "../../repositories/devices/devices.repository";
import { PostsRepository } from "../../repositories/posts/posts.repo";
import { CommentsRepository } from "../../repositories/comments/comments.repo";
import { LikesForCommentsRepository } from "../../repositories/likes/likes.for.comments.repo";
import { AuthService } from "./auth.service";
import { BannedUsersForBlogRepository } from "../../repositories/users/banned.users.for.blog.repo";
import { BlogsRepository } from "../../repositories/blogs/blogs.repo";

@Injectable()
export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    protected emailAdapter: EmailAdapter,
    protected devicesRepository: DevicesRepository,
    protected postsRepository: PostsRepository,
    protected commentsRepository: CommentsRepository,
    protected likesRepository: LikesForCommentsRepository,
    protected authService: AuthService,
    protected blogsRepository: BlogsRepository,
    protected bannedUsersForBlogRepository: BannedUsersForBlogRepository
  ) {}

  async createUser(user: UserCreateInputModelType): Promise<UsersForResponse> {
    const hash = await this.authService.generateHash(user.password);
    const newUser = new CreateUserDto(
      uuidv4(),
      user.login,
      user.email,
      hash,
      new Date(),
      uuidv4(),
      add(new Date(), { hours: 3 }),
      true,
      false,
      null,
      null
    );
    await this.usersRepository.createUser(newUser);

    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
      // banInfo: {
      //   isBanned: newUser.isBanned,
      //   banDate: newUser.banDate,
      //   banReason: newUser.banReason,
      // },
    };
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.usersRepository.findUserById(id);
    if (!user) return false;
    return await this.usersRepository.deleteUser(user.id);
  }

  async confirmUser(code: string): Promise<boolean> {
    const user = await this.usersRepository.findUserByCode(code);
    if (!user) return false;
    if (user.isConfirmed) return false;
    if (user.confirmationCode !== code) return false;
    if (user.codeExpirationDate < new Date()) return false;
    return await this.usersRepository.updateConfirmation(user.id);
  }

  async createNewConfirmationCode(userId: string, email: string) {
    const confirmCode = uuidv4();
    const expirationDate = add(new Date(), { hours: 3 });
    await this.usersRepository.updateConfirmCode(
      userId,
      confirmCode,
      expirationDate
    );
    await this.emailAdapter.sendEmailConfirmationCode(confirmCode, email);
  }

  async updateBanStatusForUser(
    id: string,
    banStatus: boolean,
    banReason: string
  ) {
    const user = await this.usersRepository.findUserById(id);
    if (!user) throw new BadRequestException();

    const banDate = banStatus ? new Date() : null;

    if (!banStatus) {
      banReason = null;
    }

    await this.usersRepository.updateBanStatus(
      user.id,
      banStatus,
      banReason,
      banDate
    );

    if (banStatus === true) {
      await this.devicesRepository.deleteDevicesForBannedUser(id);
    }

    //await this.postsRepository.updateVisibleStatus(id, banStatus);
    // await this.commentsRepository.updateVisibleStatus(id, banStatus);
    // await this.likesRepository.updateVisibleStatus(id, banStatus);
  }

  // async updateUserBanStatusForBlog(
  //   id: string,
  //   banStatus: boolean,
  //   banReason: string,
  //   blogId: string,
  //   userIdBlogOwner: string
  // ) {
  //   const user = await this.usersRepository.findUserById(id);
  //   if (!user) throw new NotFoundException();
  //
  //   const blog = await this.blogsRepository.getBlogById(blogId);
  //
  //   if (userIdBlogOwner !== blog.userId)
  //     throw new HttpException("Not Your Own", 403);
  //
  //   const bannedUser = new BannedUserForBlogDto(
  //     id,
  //     user.login,
  //     banStatus,
  //     banReason,
  //     new Date(),
  //     blogId
  //   );
  //
  //   if (banStatus) {
  //     const user = await this.bannedUsersForBlogRepository.getBannedUserById(
  //       id
  //     );
  //     if (user) return true;
  //     return await this.bannedUsersForBlogRepository.addBannedUser(bannedUser);
  //   } else {
  //     const user = await this.bannedUsersForBlogRepository.getBannedUserById(
  //       id
  //     );
  //     if (!user) return false;
  //     return await this.bannedUsersForBlogRepository.deleteBannedUser(id);
  //   }
  // }
}
