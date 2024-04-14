import { Module } from '@nestjs/common';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';
import { AnswerModule } from 'src/answer/answer.module';

@Module({
  imports: [AnswerModule],
  controllers: [StatController],
  providers: [StatService],
})
export class StatModule {}
