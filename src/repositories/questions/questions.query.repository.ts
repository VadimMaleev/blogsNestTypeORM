import { Injectable } from "@nestjs/common";
import { QuestionsQueryDto } from "../../types/dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Question } from "./question.entity";
import { ILike, Repository } from "typeorm";

@Injectable()
export class QuestionsQueryRepository {
  constructor(
    @InjectRepository(Question)
    protected questionRepository: Repository<Question>
  ) {}

  async findQuestions(query: QuestionsQueryDto) {
    const bodySearchTerm: string = query.bodySearchTerm || "";
    const publishedStatus: string = query.publishedStatus || "all";
    const pageNumber: number = Number(query.pageNumber) || 1;
    const pageSize: number = Number(query.pageSize) || 10;
    const sortBy: string = query.sortBy || "createdAt";
    const sortDirection = query.sortDirection || "DESC";

    let filter = {};
    if (publishedStatus === "published") {
      filter = { body: ILike("%" + bodySearchTerm + "%"), published: true };
    }
    if (publishedStatus === "notPublished") {
      filter = { body: ILike("%" + bodySearchTerm + "%"), published: false };
    }
    if (publishedStatus === "all") {
      filter = { body: ILike("%" + bodySearchTerm + "%") };
    }

    const questions = await this.questionRepository.find({
      select: {
        id: true,
        body: true,
        correctAnswers: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
      where: filter,
      order: { [sortBy]: sortDirection },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await this.questionRepository.count({ where: filter });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: questions,
    };
  }
}
