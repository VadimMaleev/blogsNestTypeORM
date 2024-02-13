import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Question } from "./question.entity";
import { Repository } from "typeorm";
import { CreateQuestionDto } from "../../types/dto";
import {
  QuestionCreateInputModelType,
  QuestionPublishUpdateInputModel,
} from "../../types/input.models";

@Injectable()
export class QuestionsRepository {
  constructor(
    @InjectRepository(Question)
    protected questionRepository: Repository<Question>
  ) {}

  async createQuestion(newQuestion: CreateQuestionDto) {
    return this.questionRepository.save(newQuestion);
  }

  async deleteQuestion(id: string): Promise<boolean> {
    await this.questionRepository.delete({ id: id });
    return true;
  }

  async updateQuestion(id: string, inputModel: QuestionCreateInputModelType) {
    await this.questionRepository.update(
      { id: id },
      { body: inputModel.body, correctAnswers: inputModel.correctAnswers }
    );
    return true;
  }

  async updateQuestionPublishStatus(
    id: string,
    inputModel: QuestionPublishUpdateInputModel
  ) {
    await this.questionRepository.update(
      { id: id },
      { published: inputModel.published }
    );
    return true;
  }

  async getQuestionById(id: string) {
    return this.questionRepository.findOneBy({ id: id });
  }
}
