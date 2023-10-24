import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PublicBlogsController } from "./api/public.api/blogs/publicBlogsController";
import { BlogsRepository } from "./repositories/blogs/blogs.repo";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { BlogsQueryRepository } from "./repositories/blogs/blogs.query.repo";
import { UsersSAController } from "./api/sa.api/users/usersSAController";
import { UsersService } from "./application/services/users.service";
import { UsersRepository } from "./repositories/users/users.repo";
import { UsersQueryRepository } from "./repositories/users/users.query.repo";
import { AuthService } from "./application/services/auth.service";
import { PublicPostsController } from "./api/public.api/posts/publicPostsController";
import { PostsService } from "./application/services/posts.service";
import { PostsRepository } from "./repositories/posts/posts.repo";
import { PostsQueryRepository } from "./repositories/posts/posts.query.repo";
import { PublicCommentsController } from "./api/public.api/comments/publicCommentsController";
import { CommentsService } from "./application/services/comments.service";
import { CommentsRepository } from "./repositories/comments/comments.repo";
import { CommentsQueryRepository } from "./repositories/comments/comments.query.repo";
import { TestingController } from "./api/public.api/testing/testing.controller";
import { RecoveryCodeRepository } from "./repositories/recovery.codes/recovery.code.repo";
import { EmailAdapter } from "./adapters/email-adapter";
import { JWTService } from "./repositories/jwt/jwt.service";
import { AuthController } from "./api/public.api/auth/auth.controller";
import { DevicesRepository } from "./repositories/devices/devices.repository";
import { DevicesQueryRepository } from "./repositories/devices/devices.query.repository";
import { ThrottlerModule } from "@nestjs/throttler";
import { DevicesController } from "./api/public.api/devices/devices.controller";
import { DevicesService } from "./application/services/devices.service";
import { JwtRepository } from "./repositories/jwt/jwt.repository";
import { LikesRepository } from "./repositories/likes/likes.repo";
import { ExtractUserIdFromHeadersUseCase } from "./helpers/extract.userId.from.headers";
import { BlogExistRule } from "./helpers/validator.blogId";
import { BlogsService } from "./application/services/blogs.service";
import { BloggersBlogsController } from "./api/bloggers.api/blogs/bloggersBlogsController";
import { BlogsSAController } from "./api/sa.api/blogs/blogsSAController";
import { CheckCredentialsUseCase } from "./application/use.cases/check.credentials.useCase";
import { CreateUserUseCase } from "./application/use.cases/create.user.useCase";
import { LogoutUseCase } from "./application/use.cases/logout.useCase";
import { CqrsModule } from "@nestjs/cqrs";
import { NewPasswordUseCase } from "./application/use.cases/new.password.useCase";
import { PasswordRecoveryUseCase } from "./application/use.cases/password.recovery.useCase";
import { BloggersUsersController } from "./api/bloggers.api/users/bloggers.users.controller";
import { BannedUsersForBlogRepository } from "./repositories/users/banned.users.for.blog.repo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./repositories/users/user.entity";
import { RecoveryCode } from "./repositories/recovery.codes/recovery.code.entity";

const useCases = [
  CheckCredentialsUseCase,
  CreateUserUseCase,
  LogoutUseCase,
  NewPasswordUseCase,
  PasswordRecoveryUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      url: "postgres://VadimMaleev:Q1BS4wvXkaUo@ep-lively-night-96871029.eu-central-1.aws.neon.tech/neondb",
      type: "postgres",
      ssl: true,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, RecoveryCode]),
    CqrsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.test),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
  ],
  controllers: [
    AppController,
    PublicBlogsController,
    UsersSAController,
    PublicPostsController,
    PublicCommentsController,
    TestingController,
    AuthController,
    DevicesController,
    BloggersBlogsController,
    BloggersUsersController,
    BlogsSAController,
    UsersSAController,
  ],
  providers: [
    AppService,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthService,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    RecoveryCodeRepository,
    EmailAdapter,
    JWTService,
    DevicesService,
    DevicesRepository,
    DevicesQueryRepository,
    JwtRepository,
    LikesRepository,
    BannedUsersForBlogRepository,
    ExtractUserIdFromHeadersUseCase,
    BlogExistRule,
    ...useCases,
  ],
})
export class AppModule {}
