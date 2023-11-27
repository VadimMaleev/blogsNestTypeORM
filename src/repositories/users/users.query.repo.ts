import { UsersQueryDto } from "../../types/dto";
import { UsersPaginationResponse } from "../../types/types";
import { Injectable } from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectRepository(User)
    protected usersRepository: Repository<User>
  ) {}

  async getUsers(query: UsersQueryDto): Promise<UsersPaginationResponse> {
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || "createdAt";
    const sortDirection = query.sortDirection || "DESC";
    const login: string = query.searchLoginTerm || "";
    const email: string = query.searchEmailTerm || "";
    const banStatus: string = query.banStatus || "all";

    const _query = [];
    if (login) {
      _query.push({ login: ILike("%" + login + "%") });
    }
    if (email) {
      _query.push({ email: ILike("%" + email + "%") });
    }

    if (banStatus === "banned") {
      _query.push({ isBanned: true });
    }

    if (banStatus === "notBanned") {
      _query.push({ isBanned: false });
    }

    const queryFetch = _query.length ? _query : {};
    const users = await this.usersRepository.find({
      select: {
        id: true,
        login: true,
        email: true,
        createdAt: true,
      },
      where: queryFetch,
      order: { [sortBy]: sortDirection },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await this.usersRepository.count({ where: queryFetch });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: users,
    };
  }
}
