import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from 'src/configs/database.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        retryAttempts: configService.get<number>('database.retryAttempts'),
        retryDelay: configService.get<number>('database.retryDelay'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [],
})
export class DatabaseModule {}
