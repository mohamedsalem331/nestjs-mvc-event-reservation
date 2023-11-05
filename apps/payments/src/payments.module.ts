import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { AppLoggerMiddleware, NOTIFICATIONS_SERVICE, PAYMENTS_SERVICE } from '@app/common';
import * as joi from 'joi';
import {
  ConfigService,
  ConfigModule,
} from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        STRIPE_SECRET_KEY: joi.string().required(),
        TCP_PORT: joi.number().required(),
        NOTIFICATIONS_HOST: joi.string().required(),
        NOTIFICATIONS_PORT: joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>("RABBIT_MQ_URI")],
            queue: NOTIFICATIONS_SERVICE,
          },
        }),
        inject: [ConfigService]
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
