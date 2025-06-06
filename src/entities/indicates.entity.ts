import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MarketIndex extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true, type: 'number' })
  currentPrice: number;

  @Prop({ required: true, type: 'number' })
  openPrice: number;

  @Prop({ required: true, type: 'number' })
  highestPrice: number;

  @Prop({ required: true, type: 'number' })
  lowestPrice: number;

  @Prop({ required: true, type: 'number' })
  changePercentage: number;

  @Prop({ required: true, type: 'number' })
  lastUpdate: number;
}

export const MarketIndexSchema = SchemaFactory.createForClass(MarketIndex);
