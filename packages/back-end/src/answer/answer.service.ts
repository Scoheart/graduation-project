import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
  ) {}
  create(createAnswerDto: CreateAnswerDto) {
    return this.answerRepository.save(createAnswerDto);
  }

  findAll(questionId: number) {
    return this.answerRepository.find({
      where: {
        questionId: +questionId,
      },
    });
  }
}
