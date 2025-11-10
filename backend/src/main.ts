import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // for DTO validation
  app.enableCors({
    origin: 'http://localhost:5173', // Only allows your frontend
  });

  app.use((req, res, next) => {
    console.log(
      `[${req.method}] ${req.url}: ${req.body ? JSON.stringify(req.body) : ''}`,
    );
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
