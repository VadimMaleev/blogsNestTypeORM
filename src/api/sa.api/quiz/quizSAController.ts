import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { BasicAuthGuard } from "../../../guards/basic.auth.guard";
import {
  QuestionCreateInputModelType,
  QuestionPublishUpdateInputModel,
} from "../../../types/input.models";
import { QuestionsService } from "../../../application/services/questionsService";
import { QuestionsQueryDto } from "../../../types/dto";
import { QuestionsQueryRepository } from "../../../repositories/questions/questions.query.repository";

@Controller("/sa/quiz/questions")
export class QuizSAController {
  constructor(
    protected quizQuestionsService: QuestionsService,
    protected questionsQueryRepository: QuestionsQueryRepository
  ) {}

  @Post()
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  async createQuestion(
    @Body() questionInputModel: QuestionCreateInputModelType
  ) {
    return this.quizQuestionsService.createQuestion(questionInputModel);
  }

  @Delete(":id")
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deleteQuestion(@Param("id") id: string) {
    const isDeleted = await this.quizQuestionsService.deleteQuestion(id);
    if (!isDeleted) throw new NotFoundException("Question not Found");
    return isDeleted;
  }

  @Put(":id")
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async updateQuestion(
    @Param("id") id: string,
    @Body() inputModel: QuestionCreateInputModelType
  ) {
    const isUpdated = await this.quizQuestionsService.updateQuestion(
      id,
      inputModel
    );
    if (!isUpdated) throw new NotFoundException("Question not Found");
    return isUpdated;
  }

  @Put(":id/publish")
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async updateQuestionPublishStatus(
    @Param("id") id: string,
    @Body() inputModel: QuestionPublishUpdateInputModel
  ) {
    const isUpdated =
      await this.quizQuestionsService.updateQuestionPublishStatus(
        id,
        inputModel
      );
    if (!isUpdated) throw new NotFoundException("Question not Found");
    return isUpdated;
  }

  @Get()
  @UseGuards(BasicAuthGuard)
  async findQuestions(@Query() query: QuestionsQueryDto) {
    return this.questionsQueryRepository.findQuestions(query);
  }
}
