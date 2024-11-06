import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('First interceptor called');
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log('Third interceptor called after handling the request'),
        ),
      );
  }
}
