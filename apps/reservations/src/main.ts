import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';
import * as session from 'express-session';
import { join } from 'path';
import { NotFoundExceptionFilter } from '@app/common';

// app.useStaticAssets(join('libs', 'common', 'public'));
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ReservationsModule);
  // app.useStaticAssets(join('apps', 'reservations', 'public'));
  app.useStaticAssets(join('libs', 'common', 'public'));
  app.setBaseViewsDir(join('apps', 'reservations', 'views'));
  hbs.registerPartials(join('apps', 'reservations', 'views/layouts'));
  hbsUtils(hbs).registerWatchedPartials(join('apps', 'reservations', 'views/layouts'));
  app.setViewEngine('hbs');
  app.useGlobalFilters(new NotFoundExceptionFilter())

  app.use(cookieParser());
  app.setGlobalPrefix('reservations');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService: ConfigService = app.get(ConfigService);
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
