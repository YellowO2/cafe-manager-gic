import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // for DTO validation
  app.enableCors({
    origin: process.env.CORS_ORIGIN, // Read from environment variable
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
