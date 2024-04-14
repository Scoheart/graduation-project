import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatService } from './stat.service';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import { AnswerService } from 'src/answer/answer.service';

@Controller('stat')
export class StatController {
  constructor(
    private readonly statService: StatService,
    private readonly answerService: AnswerService,
  ) {}

  @Get(':questionId')
  async findOne(
    @Param('questionId') id: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    const { data, total } = await this.answerService.findAll(
      +id,
      page,
      pageSize,
    );
    const statList = data.map((answer) => {
      const stat: {
        id: number;
        [index: string]: string | number;
      } = {
        id: 0,
      };
      const { id, answerList } = answer;
      stat.id = id;

      answerList.forEach((answer) => {
        stat[answer.componentId] = answer.value;
      });

      return stat;
    });
    return {
      total: total,
      list: statList,
    };
  }

  @Get(':questionId/:componentId')
  findAll(
    @Param('questionId') id: string,
    @Param('componentId') componentId: string,
  ) {
    return {
      stat: [{ name: 'item1', count: 2 }],
    };
  }
}
