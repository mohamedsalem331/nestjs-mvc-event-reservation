import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { AppLoggerMiddleware, } from '@app/common';
import {
  ConfigService,
  ConfigModule,
} from '@nestjs/config';
import * as joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: joi.object({
        TCP_PORT: joi.number().required(),
        RABBIT_MQ_URI: joi.string().required(),
        RABBIT_MQ_NOTIFICATIONS_QUEUE: joi.string().required(),
      }),
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
