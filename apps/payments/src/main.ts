import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { NotFoundExceptionFilter, PAYMENTS_SERVICE, } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService: ConfigService = app.get(ConfigService);
  app.useGlobalFilters(new NotFoundExceptionFilter())

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBIT_MQ_URI')],
      queue: PAYMENTS_SERVICE,
      queueOptions: {
        durable: true
      },
    },
  });  // const rmqService = app.get<RmqService>(RmqService)
  // app.connectMicroservice(rmqService.getOptions(PAYMENTS_SERVICE?.toUpperCase()));
  app.setGlobalPrefix(PAYMENTS_SERVICE);
  await app.startAllMicroservices();
}
bootstrap();
