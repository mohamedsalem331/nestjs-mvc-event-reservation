import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { NotificationsModule } from './notifications.module';
import { NotFoundExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  //fdsfds
  // const rmqService = app.get<RmqService>(RmqService)
  // app.connectMicroservice(rmqService.getOptions(NOTIFICATIONS_SERVICE?.toUpperCase()));
  const configService: ConfigService = app.get(ConfigService);
  app.useGlobalFilters(new NotFoundExceptionFilter())

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBIT_MQ_URI')],
      queue: 'notifications',
      queueOptions: {
        durable: true
      },
    },
  });
  app.setGlobalPrefix('notifications');
  await app.startAllMicroservices();
}
bootstrap();  
