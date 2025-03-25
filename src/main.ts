import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { AppLoggerService } from './common/logger/logger.service';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CommonResponseInterceptor } from './common/interceptors/common-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipMissingProperties: false,
    }),
  );

  //temp commented
  // Apply the exception filter globally
  app.useGlobalFilters(new ValidationExceptionFilter()); // Apply custom filter

  // Apply the interceptor globally
  app.useGlobalInterceptors(new CommonResponseInterceptor());

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');
  const logger = app.get(AppLoggerService);
  const port = configService.get<string>('PORT') ?? 8000;
  logger.log(`Application started on port: ${port}`);

  const config = new DocumentBuilder()
    .setTitle('Frontdesk')
    .setDescription('The frontdesk API description')
    .setVersion('1.0')
    .addBearerAuth()
    .setBasePath('api/v1')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger UI available at: http://localhost:${port}/api/docs`);
}

bootstrap();
