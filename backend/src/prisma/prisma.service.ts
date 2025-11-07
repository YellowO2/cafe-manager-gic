// backend/src/prisma/prisma.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // This is an optional step, but it's good practice.
    // It ensures that we can successfully connect to the database
    // when the application starts.
    await this.$connect();
  }
}
