import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async incrementAnswerCount(questionId: number): Promise<any> {
    const entity = await this.questionRepository.findOne({
      where: { id: questionId },
    });
    if (!entity) {
      throw new Error('Entity not found');
    }
    entity.answerCount++; // 递增 answerCount
    console.log(entity)
    return this.questionRepository.update(questionId, entity);
  }

  async create(user: User) {
    const question = await this.questionRepository.save({
      componentList: [],
      user,
    });
    return question;
  }

  async duplicate(originalId: number, user: User) {
    const originalRecord = await this.questionRepository.findOne({
      where: {
        id: originalId,
      },
    });
    if (!originalRecord) {
      throw new NotFoundException('Original record not found');
    }
    // 创建新的记录并复制属性
    const newRecord = this.questionRepository.create();
    Object.assign(newRecord, originalRecord);
    delete newRecord.id; // 可选：删除新记录的ID，以确保创建一个新的记录而不是更新现有记录
    newRecord.user = user;
    // 保存新记录到数据库中
    return await this.questionRepository.save(newRecord);
  }

  async findAll(
    page: number,
    limit: number,
    isStar: boolean,
    isPublished: boolean,
    isDeleted: boolean,
    userId: string,
  ) {
    const queryBuilder = this.questionRepository.createQueryBuilder('question');

    if (isStar) {
      queryBuilder.andWhere('question.isStar = :isStar', { isStar });
    }

    if (isPublished) {
      queryBuilder.andWhere('question.isPublished = :isPublished', {
        isPublished,
      });
    }

    if (isDeleted) {
      queryBuilder.andWhere('question.isDeleted = :isDeleted', { isDeleted });
    }

    queryBuilder.andWhere('question.userId = :userId', { userId });

    const skippedItems = (page - 1) * limit;
    const [data, total] = await queryBuilder
      .take(limit)
      .skip(skippedItems)
      .getManyAndCount();

    return { data, total };
  }

  findOne(id: number) {
    return this.questionRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return this.questionRepository.update(id, updateQuestionDto);
  }

  deleteMany(ids: number[]) {
    return this.questionRepository.delete(ids);
  }
}
