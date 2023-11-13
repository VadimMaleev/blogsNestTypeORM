import { Injectable } from "@nestjs/common";
import { BlogCreateInputModelType } from "../../types/input.models";
import { CreateBlogDto } from "../../types/dto";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Blog } from "./blogs.entity";

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Blog) protected blogsRepository: Repository<Blog>
  ) {}

  async createBlog(newBlog: CreateBlogDto) {
    return this.blogsRepository.save(newBlog);
  }

  async deleteBlog(id: string): Promise<boolean> {
    await this.blogsRepository.delete({ id: id });
    return true;
  }

  async updateBlog(
    id: string,
    inputModel: BlogCreateInputModelType
  ): Promise<boolean> {
    await this.blogsRepository.update(
      { id: id },
      {
        name: inputModel.name,
        description: inputModel.description,
        websiteUrl: inputModel.websiteUrl,
      }
    );
    return true;
  }

  async bindBlogToUser(userId, login, blogId) {
    await this.dataSource.query(
      `
        UPDATE public."Blogs"
        SET  "userId" = $1, 
             "login" = $2
        WHERE "id" = $3
        `,
      [userId, login, blogId]
    );
    return true;
  }

  async updateBanStatus(
    banStatus: boolean,
    banDate: Date | null,
    blogId: string
  ) {
    await this.blogsRepository.update(
      { id: blogId },
      { isBanned: banStatus, banDate: banDate }
    );
    return true;
  }

  async getBlogById(id: string) {
    return this.blogsRepository.findOneBy({ id: id });
  }
}
