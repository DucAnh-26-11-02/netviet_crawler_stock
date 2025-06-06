import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { redisStore } from 'cache-manager-redis-yet';
import appConfig from './configs/app.config';
import crawlerConfig from './configs/crawler.config';
import databaseConfig from './configs/database.config';
import redisConfig from './configs/redis.config';
import { DatabaseModule } from './modules/database/database.module';
import { IndicateModule } from './modules/indicates/indicates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, crawlerConfig, redisConfig],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');

        return {
          store: await redisStore({
            socket: {
              host: redisConfig.host,
              port: redisConfig.port,
              timeout: 3000,
            },
            username: redisConfig.username,
            password: redisConfig.password,
          }),
        };
      },
    }),

    ScheduleModule.forRoot(),
    DatabaseModule,

    IndicateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
