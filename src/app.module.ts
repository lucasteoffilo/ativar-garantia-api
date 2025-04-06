import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserLoginModule } from './user-login/user-login.module';
import { MulterModule } from '@nestjs/platform-express';
import { MailModule } from './mail/mail.module';
import { FormularioGarantiaModule } from './formulario-garantia/formulario-garantia.module';
import { EstatisticaModule } from './estatistica/estatistica.module';
import * as bodyParser from 'body-parser';

@Module({
  imports: [
    MulterModule.register({
        dest: './uploads',
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async (configService: ConfigService) => ({
          type: 'mysql',
          autoLoadEntities: false,
          synchronize: false,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          timezone: 'America/Sao_Paulo',
      })
    }),
    UserModule,
    AuthModule,
    UserLoginModule,
    MailModule,
    FormularioGarantiaModule,
    EstatisticaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {}
}