import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [LoggerModule.forRoot()],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class AppLoggerModule {}
