import { BlogsForResponse, BlogsPaginationResponse } from "../../types/types";
import { BlogsQueryDto } from "../../types/dto";
import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, ILike, Repository } from "typeorm";
import { Blog } from "./blog.entity";

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Blog) protected blogsRepository: Repository<Blog>
  ) {}

  async getBlogs(query: BlogsQueryDto): Promise<BlogsPaginationResponse> {
    const searchNameTerm: string = query.searchNameTerm || "";
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || "createdAt";
    const sortDirection: "asc" | "desc" = query.sortDirection || "desc";

    const filter = { name: ILike("%" + searchNameTerm + "%"), isBanned: false };

    const blogs = await this.blogsRepository.find({
      select: {
        id: true,
        name: true,
        description: true,
        websiteUrl: true,
        createdAt: true,
        isMembership: true,
      },
      where: filter,
      order: { [sortBy]: sortDirection },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await this.blogsRepository.count({
      where: filter,
    });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: blogs,
    };
  }

  // async getBlogsForUser(query: BlogsQueryDto, userId: string) {
  //   const searchNameTerm: string = query.searchNameTerm || "";
  //   const pageNumber: number = Number(query.pageNumber) || 1;
  //   const pageSize: number = Number(query.pageSize) || 10;
  //   const sortBy: string = query.sortBy || "createdAt";
  //   const sortDirection: "asc" | "desc" = query.sortDirection || "desc";
  //
  //   let filter = `"userId" = '${userId}'`;
  //   if (searchNameTerm) {
  //     filter += ` AND (LOWER("name") like LOWER('%${searchNameTerm}%'))`;
  //   }
  //
  //   const itemsForResponse = await this.dataSource.query(
  //     `
  //       SELECT "id", "name", "description", "websiteUrl", "createdAt", "isMembership"
  //       FROM public."Blogs"
  //       WHERE ${filter}
  //       ORDER BY "${sortBy}" ${sortDirection}
  //       OFFSET $1 LIMIT $2
  //     `,
  //     [(pageNumber - 1) * pageSize, pageSize]
  //   );
  //
  //   const totalCount = await this.dataSource.query(
  //     `
  //     SELECT count(*)
  //     FROM public."Blogs"
  //     WHERE ${filter}
  //     `
  //   );
  //
  //   return {
  //     pagesCount: Math.ceil(+totalCount[0].count / pageSize),
  //     page: pageNumber,
  //     pageSize: pageSize,
  //     totalCount: +totalCount[0].count,
  //     items: itemsForResponse,
  //   };
  // }

  async getPublicBlogById(id: string): Promise<BlogsForResponse | null> {
    return this.blogsRepository.findOne({
      select: {
        id: true,
        name: true,
        description: true,
        websiteUrl: true,
        createdAt: true,
        isMembership: true,
      },
      where: { id: id, isBanned: false },
    });
  }

  async getBlogsForAdmin(query: BlogsQueryDto) {
    const searchNameTerm: string = query.searchNameTerm || "";
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || "createdAt";
    const sortDirection: "asc" | "desc" = query.sortDirection || "desc";

    let filter = { name: ILike("%" + searchNameTerm + "%") };

    const blogs = await this.blogsRepository.find({
      select: {
        id: true,
        name: true,
        description: true,
        websiteUrl: true,
        createdAt: true,
        isMembership: true,
        isBanned: true,
        banDate: true,
      },
      where: filter,
      order: { [sortBy]: sortDirection },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    //add map for admin when userId is added

    const totalCount = await this.blogsRepository.count({
      where: filter,
    });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: blogs,
    };
  }
}
