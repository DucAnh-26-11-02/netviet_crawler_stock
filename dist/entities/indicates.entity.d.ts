import { Document } from 'mongoose';
export declare class MarketIndex extends Document {
    name: string;
    symbol: string;
    currentPrice: number;
    openPrice: number;
    highestPrice: number;
    lowestPrice: number;
    changePercentage: number;
    lastUpdate: number;
}
export declare const MarketIndexSchema: import("mongoose").Schema<MarketIndex, import("mongoose").Model<MarketIndex, any, any, any, Document<unknown, any, MarketIndex, any> & MarketIndex & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MarketIndex, Document<unknown, {}, import("mongoose").FlatRecord<MarketIndex>, {}> & import("mongoose").FlatRecord<MarketIndex> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
