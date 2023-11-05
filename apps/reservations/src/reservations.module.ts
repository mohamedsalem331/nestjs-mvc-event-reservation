import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  AppLoggerMiddleware,
  DatabaseModule,
  AUTH_SERVICE,
  PAYMENTS_SERVICE,
} from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import {
  ReservationDocument,
  ReservationSchema,
} from './models/reservation.schema';
import { EventDocument, EventSchema } from './models/event.schema';
import * as joi from 'joi';
import {
  ConfigService,
  ConfigModule,
} from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventsRepository } from './events.repository';
import { EventsService } from './events.service';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>("RABBIT_MQ_URI")],
            queue: AUTH_SERVICE,
            queueOptions: {

            }
          }
        }),
        inject: [ConfigService]
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>("RABBIT_MQ_URI")],
            queue: PAYMENTS_SERVICE,
          }
        }),
        inject: [ConfigService]
      }
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/apps/reservations/.env`,
      validationSchema: joi.object({
        MONGO_URI: joi.string().required(),
        HTTP_PORT: joi.number().required(),
        AUTH_HOST: joi.string().required(),
        AUTH_PORT: joi.number().required(),
        PAYMENTS_HOST: joi.string().required(),
        PAYMENTS_PORT: joi.number().required(),
      }),
    }),
    MongooseModule.forFeature([
      { name: ReservationDocument.name, schema: ReservationSchema },
      { name: EventDocument.name, schema: EventSchema },
    ]),
  ],
  providers: [ReservationsService, EventsService, ReservationsRepository, EventsRepository],
  controllers: [ReservationsController],
})
export class ReservationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
