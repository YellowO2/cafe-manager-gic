import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

/**
 * Exception filter to handle Prisma-specific errors and return user-friendly HTTP responses.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred.';

    switch (exception.code) {
      case 'P2002':
        // Unique constraint violation
        status = HttpStatus.CONFLICT;
        message = `A record with this ${String((exception.meta?.target as string[])?.[0] || 'field')} already exists.`;
        break;
      case 'P2025':
        // Record not found
        status = HttpStatus.NOT_FOUND;
        message = 'The requested record was not found.';
        break;
      case 'P2003':
        // Foreign key constraint violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid reference. The related record does not exist.';
        break;
      case 'P2014':
        // Relation violation
        status = HttpStatus.BAD_REQUEST;
        message = 'This operation violates a required relation.';
        break;
      default:
        message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.code,
    });
  }
}
