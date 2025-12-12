import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { configuration, validate } from './config';
import { entities } from './database/database.utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('config.database.host'),
        port: configService.get<number>('config.database.port'),
        username: configService.get<string>('config.database.username'),
        password: configService.get<string>('config.database.password'),
        database: configService.get<string>('config.database.database'),
        entities,
        synchronize: false,
        logging: configService.get<boolean>('config.database.logging'),
      }),
    }),
    HealthModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
