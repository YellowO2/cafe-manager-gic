import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CafesModule } from './cafes/cafes.module';

@Module({
  imports: [PrismaModule, CafesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
