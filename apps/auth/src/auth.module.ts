import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { AppLoggerMiddleware, } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import * as joi from 'joi';
import {
  ConfigService,
  ConfigModule,
} from '@nestjs/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ClientsModule } from '@nestjs/microservices';
'fdsfd'
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/apps/auth/.env`,
      validationSchema: joi.object({
        MONGO_URI: joi.string().required(),
        JWT_SECRET: joi.string().required(),
        JWT_EXPIRATION: joi.string().required(),
        HTTP_PORT: joi.number().required(),
        TCP_PORT: joi.number().required(),
      })
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
