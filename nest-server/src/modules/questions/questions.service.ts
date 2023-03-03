import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/entities/User.entity';
import { CreateQuestionDto } from './dto/questions.req.dto';
import { QuestionsRepository } from './questions.repository';

@Injectable()
export class QuestionsService {
  constructor(private questionsRepository: QuestionsRepository) {}

  async createQuestion(user: User, createQuestionDto: CreateQuestionDto) {
    const question = await this.questionsRepository.create(
      user,
      createQuestionDto,
    );
    if (!question) {
      throw new InternalServerErrorException('문의글 작성에 실패했습니다.');
    }
    return true;
  }

  async getQuestion(page: number) {
    return await this.questionsRepository.findMany(page);
  }

  async modifyQuestion(
    questionId: number,
    user: User,
    updateQuestionDto: CreateQuestionDto,
  ) {
    const question = await this.questionsRepository.findOneById(questionId);
    if (question.user.id !== user.id) {
      throw new ForbiddenException(
        '자신이 작성한 문의글만 수정할 수 있습니다.',
      );
    }
    const updateQuestion = await this.questionsRepository.update(
      questionId,
      updateQuestionDto,
    );
    if (!updateQuestion) {
      throw new InternalServerErrorException('문의글 수정에 실패했습니다.');
    }
  }
}
