import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  Put,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../../guards/jwt.auth.guard";
import { BanUserForBlogInputModel } from "../../../types/input.models";
import { UsersService } from "../../../application/services/users.service";
import { LoginQueryDto } from "../../../types/dto";

import { BannedUsersForBlogRepository } from "../../../repositories/users/banned.users.for.blog.repo";
import { BlogsRepository } from "../../../repositories/blogs/blogs.repo";

@Controller("blogger/users")
export class BloggersUsersController {
  constructor(
    protected usersService: UsersService,
    protected blogsRepository: BlogsRepository,
    protected bannedUsersForBlogRepository: BannedUsersForBlogRepository
  ) {}

  // @Put(":id/ban")
  // @HttpCode(204)
  // @UseGuards(JwtAuthGuard)
  // async updateUserBanStatusForBlog(
  //   @Param("id") id: string,
  //   @Body() inputModel: BanUserForBlogInputModel,
  //   @Request() req
  // ) {
  //   return this.usersService.updateUserBanStatusForBlog(
  //     id,
  //     inputModel.isBanned,
  //     inputModel.banReason,
  //     inputModel.blogId,
  //     req.user.id
  //   );
  // }

  // @Get("blog/:id")
  // @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  // async getBannedUsersForBLog(
  //   @Param("id") id: string,
  //   @Query() query: LoginQueryDto,
  //   @Request() req
  // ) {
  //   const blog = await this.blogsRepository.getBlogById(id);
  //   if (!blog) throw new NotFoundException("Blog Not Found");
  //   if (req.user.id !== blog.userId)
  //     throw new HttpException("Not Your Own", 403);
  //
  //   return this.bannedUsersForBlogRepository.getBannedUsersForBlog(
  //     blog.id,
  //     query
  //   );
  // }
}
