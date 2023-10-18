import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { BlogsQueryRepository } from "../../../repositories/blogs/blogs.query.repo";
import { JwtAuthGuard } from "../../../guards/jwt.auth.guard";
import {
  BlogsQueryDto,
} from "../../../types/dto";
import { BlogsRepository } from "../../../repositories/blogs/blogs.repo";

@Controller("blogger/blogs")
export class BloggersBlogsController {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected blogsQueryRepository: BlogsQueryRepository
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getBlogsForUser(@Query() query: BlogsQueryDto, @Request() req) {
    return this.blogsQueryRepository.getBlogsForUser(query, req.user.id);
  }
}
