import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { QuestionModule } from './question/question.module';
import { Question } from './question/entities/question.entity';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './jwt.middleware';
import { QuestionController } from './question/question.controller';
import { AnswerModule } from './answer/answer.module';
import { Answer } from './answer/entities/answer.entity';
import { StatModule } from './stat/stat.module';
@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '39.101.76.177',
      port: 3306,
      username: 'root',
      password: 'shuhao201028',
      database: 'query',
      entities: [User, Question, Answer],
      synchronize: true,
    }),
    QuestionModule,
    AuthModule,
    AnswerModule,
    StatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude({
        path: '/question/:id',
        method: RequestMethod.ALL,
      })
      .forRoutes(QuestionController);
  }
}
