import { ConfigType } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import crawlerConfig from 'src/configs/crawler.config';
import { MarketIndex } from 'src/entities/indicates.entity';
import { IIndicate, IIndicateInsight } from 'src/types/indicates.type';
import { IndicateGetWay } from './indicate.getway';
export declare class IndicateService {
    private readonly marketIndexModel;
    private readonly crawlerConfigData;
    private readonly cache;
    private readonly gateway;
    private readonly TTL;
    private readonly RATE_VIA_AVG;
    constructor(marketIndexModel: Model<MarketIndex>, crawlerConfigData: ConfigType<typeof crawlerConfig>, cache: Cache, gateway: IndicateGetWay);
    getAll(): Promise<IIndicate[]>;
    getIndexes(name: string): Promise<IIndicateInsight>;
    private analizeSymbol;
    private getQuote;
    private getHistory;
    private saveData;
    private analystic;
    private getSymbol;
    cronGetIndexes(): Promise<void>;
}
