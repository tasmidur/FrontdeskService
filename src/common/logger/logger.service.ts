import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, Logger, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(
  ({
    level,
    message,
    timestamp,
  }: {
    level: string;
    message: string;
    timestamp: string | Date;
  }) => {
    const localTime = new Date(timestamp).toLocaleString();
    return `${localTime} [${level}]: ${message}`;
  },
);

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger: Logger;

  constructor(private configService: ConfigService) {
    const logLevel = this.configService.get<string>('LOG_LEVEL', 'info');

    this.logger = createLogger({
      level: logLevel,
      format: combine(timestamp(), errors({ stack: true }), logFormat),
      transports: [
        new transports.Console({
          format: combine(colorize(), timestamp(), logFormat),
        }),
        new DailyRotateFile({
          filename: 'logs/log-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '10m',
          maxFiles: '15d',
          zippedArchive: true,
        }),
      ],
    });

    this.logger.on('error', err => {
      console.error('Error with logging system:', err);
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(`${message} - Trace: ${trace}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
