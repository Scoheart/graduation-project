import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  status: number;
  msg: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();
        const status = response.statusCode;
        let msg = '';
        if (status >= 200 && status < 300) {
          msg = 'success';
        } else {
          msg = 'error';
        }
        return {
          status,
          msg,
          data,
        };
      }),
    );
  }
}
