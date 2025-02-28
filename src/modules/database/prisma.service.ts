import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { AppLoggerService } from '../../common/logger/logger.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly logger: AppLoggerService) {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private handleConnectionError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P1001') {
        this.logger.error(
          'Database connection error: Unable to connect to the database server. Please ensure the server is running and accessible.', error.message
        );
      } else {
        this.logger.error('Database error:', error.message);
      }
    } else {
      this.logger.error('Unexpected database error:', error);
    }
    throw new Error(
      'Failed to connect to the database. Check the database server and ensure it is accessible.',
    );
  }
}
