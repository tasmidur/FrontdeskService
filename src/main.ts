import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppLoggerService } from './common/logger/logger.service';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { ValidationPipe } from '@nestjs/common';

import { CommonResponseInterceptor } from './common/interceptors/common-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true, 
    transform: true,
    skipMissingProperties: false, 
  }));
  
  //temp commented
  // Apply the exception filter globally
  app.useGlobalFilters(new ValidationExceptionFilter()); // Apply custom filter

  // Apply the interceptor globally
  app.useGlobalInterceptors(new CommonResponseInterceptor());

  const configService = app.get(ConfigService);
  const logger = app.get(AppLoggerService); 
  const port = configService.get<string>('PORT') ?? 8000;
  logger.log(`Application started on port: ${port}`);

  await app.listen(port);
}

bootstrap();
