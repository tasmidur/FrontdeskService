import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { catchError, map, tap } from 'rxjs/operators';
  import { CommonResponse } from '../response-model/common-response.model';

  
  @Injectable()
  export class CommonResponseInterceptor<T>
    implements NestInterceptor<T, CommonResponse<T>>
 {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // Access the response object
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        return next.handle().pipe(
          // Side effect: Log the original data
          tap((data) => {
            console.log('Original Response Data:', data);
          }),
          // Transform the response into the CommonResponse format
          map((data) => new CommonResponse(true, 'Success', response.statusCode, data)),        
          // Handle errors
          catchError((err) => {
            let response: any;
            let status: number;
    
            if (err instanceof HttpException) {
              return throwError(() => err); // Allow the ValidationExceptionFilter to handle it
              /* response = err.getResponse();
              status = err.getStatus(); */ 
            } else {
              response = {
                message: err.message || 'An unexpected error occurred',
              };
              status = HttpStatus.INTERNAL_SERVER_ERROR;
            }
    
            // Use `throwError` to return a new Observable with the error response
            return throwError(() => new HttpException(
              new CommonResponse(false, 'Fail', status.toString(), response), status),
              
            );
          }), 
      );
    }
  }
  