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

    let filter = { body: ILike("%" + bodySearchTerm + "%") };
    let published = {};

    if (publishedStatus === "published") {
      published = { published: true };
    }
    if (publishedStatus === "notPublished") {
      published = { published: false };
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
      where: { ...filter, ...published },
      order: { [sortBy]: sortDirection },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await this.questionRepository.count({
      where: { ...filter, ...published },
    });

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: questions,
    };
  }

  async getFiveRandomQuestionsForGame(): Promise<
    { id: string; body: string }[]
  > {
    return this.questionRepository
      .createQueryBuilder("q")
      .select("q.id, q.body")
      .where("q.published = :boolean", { boolean: true })
      .orderBy("RANDOM()")
      .take(5)
      .getRawMany();
  }
}
