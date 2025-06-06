import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketIndex, MarketIndexSchema } from 'src/entities/indicates.entity';
import { IndicateGetWay } from './indicate.getway';
import { IndicateController } from './indicates.controller';
import { IndicateService } from './indicates.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: MarketIndex.name, schema: MarketIndexSchema }])],
  providers: [IndicateService, IndicateGetWay],
  controllers: [IndicateController],
})
export class IndicateModule {}
