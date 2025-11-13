import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove extra fields from request to prevent unwanted data
      transform: true, // payloads to DTO instances for checking
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.enableCors({
    origin: process.env.CORS_ORIGIN, // Read from environment variable
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
