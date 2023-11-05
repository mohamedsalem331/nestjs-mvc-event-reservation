import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AUTH_SERVICE, NotFoundExceptionFilter } from '@app/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';
import * as session from 'express-session';

// const rmqService = app.get<RmqService>(RmqService)
// app.connectMicroservice(rmqService.getOptions(AUTH_SERVICE?.toUpperCase()));

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule);
  const configService: ConfigService = app.get(ConfigService);

  // app.useStaticAssets(join('apps', 'auth', 'public'));
  app.useStaticAssets(join('libs', 'common', 'public'));
  app.setBaseViewsDir(join('apps', 'auth', 'views'));
  hbs.registerPartials(join('apps', 'reservations', 'views/layouts'));
  hbsUtils(hbs).registerWatchedPartials(join('apps', 'reservations', 'views/layouts'));
  app.setViewEngine('hbs');
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useGlobalFilters(new NotFoundExceptionFilter())
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBIT_MQ_URI')],
      queue: AUTH_SERVICE,
      queueOptions: {
        durable: true
      },
    },
  });
  app.use(cookieParser());
  app.setGlobalPrefix('auth');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.startAllMicroservices();

  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();

