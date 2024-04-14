import { Controller, Get, Param } from '@nestjs/common';
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
  async findOne(@Param('questionId') id: string) {
    const data = await this.answerService.findAll(+id);
    const statList = data.map((answer) => {
      const stat: {
        questionId: number;
        [index: string]: string | number;
      } = {
        questionId: 0,
      };
      const { questionId, answerList } = answer;
      stat.questionId = questionId;

      answerList.forEach((answer) => {
        stat[answer.componentId] = answer.value;
      });

      return stat;
    });
    return statList;
  }
}
