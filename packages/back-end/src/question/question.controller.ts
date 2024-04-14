import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Req() request) {
    const { user } = request;
    return this.questionService.create(user);
  }

  @Post('/duplicate/:id')
  duplicate(@Param('id') id: string, @Req() request) {
    const { user } = request;
    return this.questionService.duplicate(+id, user);
  }

  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('isStar') isStar: string,
    @Query('isPublish') isPublish: string,
    @Query('isDeleted') isDeleted: string,
    @Req() request,
  ) {
    const {
      user: { id },
    } = request;
    const { data, total } = await this.questionService.findAll(
      parseInt(page),
      parseInt(limit),
      !!isStar,
      !!isPublish,
      !!isDeleted,
      id,
    );
    return {
      list: data,
      total: total,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete()
  deleteMany(@Body('ids') ids: number[]) {
    return this.questionService.deleteMany(ids);
  }
}
