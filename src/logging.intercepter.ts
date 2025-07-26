import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, query, body } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const res = context.switchToHttp().getResponse();
        const { statusCode } = res;
        this.logger.log(
          JSON.stringify({
            route: originalUrl,
            method,
            query,
            body,
            statusCode,
            response: data,
            time: Date.now() - now,
          }),
        );
      }),
      catchError((err) => {
        const res = context.switchToHttp().getResponse();
        const { statusCode } = res;
        this.logger.error(
          JSON.stringify({
            route: originalUrl,
            method,
            query,
            body,
            statusCode,
            error: err.response || err.message,
            time: Date.now() - now,
          }),
        );
        throw err;
      }),
    );
  }
}
