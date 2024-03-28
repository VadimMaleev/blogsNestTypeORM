import { HttpException, Injectable } from "@nestjs/common";
import {
  QuestionCreateInputModelType,
  QuestionPublishUpdateInputModel,
} from "../../types/input.models";
import { QuizQuestionResponse } from "../../types/types";
import { CreateQuestionDto } from "../../types/dto";
import { v4 as uuidv4 } from "uuid";
import { QuestionsRepository } from "../../repositories/questions/questions.repository";

@Injectable()
export class QuestionsService {
  constructor(protected questionsRepository: QuestionsRepository) {}

  async createQuestion(
    question: QuestionCreateInputModelType
  ): Promise<QuizQuestionResponse> {
    const newQuestion = new CreateQuestionDto(
      uuidv4(),
      question.body,
      question.correctAnswers,
      false,
      new Date(),
      new Date()
    );

    await this.questionsRepository.createQuestion(newQuestion);
    return {
      id: newQuestion.id,
      body: newQuestion.body,
      correctAnswers: newQuestion.correctAnswers,
      published: newQuestion.published,
      createdAt: newQuestion.createdAt,
      updatedAt: newQuestion.updatedAt,
    };
  }

  async deleteQuestion(id: string) {
    const question = await this.questionsRepository.getQuestionById(id);
    if (!question) return false;
    return this.questionsRepository.deleteQuestion(id);
  }

  async updateQuestion(id: string, inputModel: QuestionCreateInputModelType) {
    const question = await this.questionsRepository.getQuestionById(id);
    if (!question) return false;
    if (question.published)
      throw new HttpException("Question was published", 400);
    return this.questionsRepository.updateQuestion(id, inputModel);
  }

  async updateQuestionPublishStatus(
    id: string,
    inputModel: QuestionPublishUpdateInputModel
  ) {
    const question = await this.questionsRepository.getQuestionById(id);
    if (!question) return false;
    return this.questionsRepository.updateQuestionPublishStatus(id, inputModel);
  }
}
