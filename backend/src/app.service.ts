import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! This is a cafe management system backend. Please go to /cafes to manage cafes.';
  }
}
