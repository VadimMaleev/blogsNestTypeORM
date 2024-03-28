//Query
import { PaginationInputModel } from "./input.models";
import { GameStatusEnum } from "./types";

export class BlogsQueryDto extends PaginationInputModel {
  searchNameTerm: string;
}

export class UsersQueryDto extends PaginationInputModel {
  searchLoginTerm: string;
  searchEmailTerm: string;
  banStatus: string;
}

export class LoginQueryDto extends PaginationInputModel {
  searchLoginTerm: string;
}

export class QuestionsQueryDto extends PaginationInputModel {
  bodySearchTerm: string;
  publishedStatus: string;
}

//DeleteParams
export class UriParamsForBloggersApi {
  blogId: string;
  postId: string;
}

//BindBlogToUserParams

export class BindBlogToUserParams {
  blogId: string;
  userId: string;
}

//Create
export class CreateBlogDto {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: Date,
    public isMembership: boolean,
    // public userId: string,
    // public login: string,
    public isBanned: boolean
  ) {}
}

export class CreateUserDto {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public passwordHash: string,
    public createdAt: Date,
    public confirmationCode: string,
    public codeExpirationDate: Date,
    public isConfirmed: boolean,
    public isBanned: boolean,
    public banDate: Date | null,
    public banReason: string
  ) {}
}

export class CreatePostDto {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: Date,
    // public userId: string,
    public isVisible: boolean
  ) {}
}

export class CreateCommentDto {
  constructor(
    public id: string,
    public content: string,
    public userId: string,
    public userLogin: string,
    public createdAt: Date,
    public postId: string,
    public isVisible: boolean
  ) {}
}

export class RecoveryCodeDto {
  constructor(
    public code: string,
    public codeExpirationDate: Date,
    public userId: string
  ) {}
}

export class CreateDeviceDto {
  constructor(
    public deviceId: string,
    public ip: string,
    public title: string,
    public userId: string,
    public lastActiveDate: Date
  ) {}
}

export class CreateQuestionDto {
  constructor(
    public id: string,
    public body: string,
    public correctAnswers: string[],
    public published: boolean,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}

export class CreateGameDto {
  constructor(
    public id: string,
    public firstPlayerId: string,
    public secondPlayerId: string | null,
    public firstPlayerScore: number,
    public secondPlayerScore: number,
    public firstPlayerLogin: string,
    public secondPlayerLogin: string | null,
    public status: GameStatusEnum,
    public pairCreatedDate: Date,
    public startGameDate: Date | null,
    public finishGameDate: Date | null
  ) {}
}

export class BannedUserForBlogDto {
  constructor(
    public userId: string,
    public login: string,
    public isBanned: boolean,
    public banReason: string,
    public banDate: Date,
    public blogId: string
  ) {}
}
