import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Increase body size limits to support base64-encoded logo uploads (default is ~100kb)
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));
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
