import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { Model, Types } from 'mongoose';
import crawlerConfig from 'src/configs/crawler.config';
import { MarketIndex } from 'src/entities/indicates.entity';
import {
  IHistoryFMPSymbol,
  IHistoryFMPSymbolAnalyst,
  IIndicate,
  IIndicateInsight,
  IMarketIndexObject,
  IQuoteFMPData,
  ISaveIndicate,
} from 'src/types/indicates.type';
import { createDateObject, formatDateObject, getShiftedDate } from 'src/utils/time';
import { IndicateGetWay } from './indicate.getway';

@Injectable()
export class IndicateService {
  private readonly TTL: number = 60;
  private readonly RATE_VIA_AVG = 5;

  constructor(
    @InjectModel(MarketIndex.name) private readonly marketIndexModel: Model<MarketIndex>,
    @Inject(crawlerConfig.KEY) private readonly crawlerConfigData: ConfigType<typeof crawlerConfig>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly gateway: IndicateGetWay,
  ) {}

  public async getAll(): Promise<IIndicate[]> {
    const data = await this.marketIndexModel.find();

    return data.map((d) => {
      const objectData = d.toObject<IMarketIndexObject>();

      const res: IIndicate = {
        id: objectData._id.toString(),
        symbol: objectData.symbol,
        name: objectData.name,
        changePercentage: objectData.changePercentage,
        currentPrice: objectData.currentPrice,
        highestPrice: objectData.highestPrice,
        lowestPrice: objectData.lowestPrice,
        openPrice: objectData.openPrice,
        lastUpdate: objectData.lastUpdate,
      };

      return res;
    });
  }

  public async getIndexes(name: string): Promise<IIndicateInsight> {
    const trimedName = name.trim();
    const symbol: string | undefined = this.getSymbol(trimedName);

    const analizedSymbol = await this.analizeSymbol(symbol);

    this.gateway.sendUpdate(analizedSymbol);

    return analizedSymbol;
  }

  private async analizeSymbol(symbol: string): Promise<IIndicateInsight> {
    const cached: IIndicateInsight | null | undefined = await this.cache.get(symbol);
    if (!!cached) {
      return cached;
    }

    const quoteData = await this.getQuote(symbol);

    if (!quoteData) {
      throw new Error(`Failed to crawl ${symbol}`);
    }

    const indicate: IIndicate = {
      id: '',
      symbol: symbol,
      name: '',
      changePercentage: 0,
      currentPrice: 0,
      highestPrice: 0,
      lowestPrice: 0,
      openPrice: 0,
      lastUpdate: Date.now(),
    };

    if (quoteData) {
      indicate.name = quoteData.name;
      indicate.changePercentage = quoteData.changePercentage;
      indicate.currentPrice = quoteData.price;
      indicate.openPrice = quoteData.open;
      indicate.lowestPrice = quoteData.dayHigh;
      indicate.highestPrice = quoteData.dayLow;
      indicate.lastUpdate = quoteData.timestamp;
    }

    const currentDateObj = createDateObject(new Date());
    const toDateObj = getShiftedDate(currentDateObj, -1);
    const fromDateObj = getShiftedDate(toDateObj, -10);

    const from = formatDateObject(fromDateObj, 'YYYY-MM-DD');
    const to = formatDateObject(toDateObj, 'YYYY-MM-DD');

    const historyIndexes = await this.getHistory(symbol, from, to);

    const analystic: IHistoryFMPSymbolAnalyst = this.analystic(
      historyIndexes,
      indicate.currentPrice,
    );

    const savedIndex = await this.saveData(symbol, indicate);

    const indexObject = savedIndex.toObject<IMarketIndexObject>();
    indicate.id = indexObject._id.toString();

    const response: IIndicateInsight = {
      ...analystic,
      name: indicate.name,
      symbol,
    };

    await this.cache.set(symbol, response, this.TTL);

    return response;
  }

  private async getQuote(symbol: string): Promise<IQuoteFMPData | null> {
    const { apiKey, url } = this.crawlerConfigData;

    const data = await axios
      .get<IQuoteFMPData[]>(`${url}/quote`, {
        params: {
          apikey: apiKey,
          symbol: symbol,
        },
      })
      .catch((e) => {
        throw new Error(e);
      });

    if (data.status > 199 && data.status < 300 && data.data[0]) {
      const quoteData = data.data[0];

      return quoteData;
    }

    return null;
  }

  private async getHistory(symbol: string, from: string, to: string): Promise<IHistoryFMPSymbol[]> {
    const { apiKey, url } = this.crawlerConfigData;

    const data = await axios
      .get<IHistoryFMPSymbol[]>(`${url}/historical-price-eod/full`, {
        params: {
          apikey: apiKey,
          symbol: symbol,
          from,
          to,
        },
      })
      .catch((e) => {
        throw new Error(e);
      });

    if (data.status > 199 && data.status < 300) {
      return data.data;
    }

    return [];
  }

  private async saveData(symbol: string, data: ISaveIndicate): Promise<MarketIndex> {
    const isExist = await this.marketIndexModel.findOne({
      symbol,
    });

    let id: null | string = null;

    if (isExist) {
      id = isExist._id.toString();

      await this.marketIndexModel.updateOne(
        { _id: new Types.ObjectId(id) },
        {
          $set: data,
        },
      );
    } else {
      const savedRecord = await this.marketIndexModel.create({ ...data, symbol });

      id = savedRecord._id.toString();
    }

    return await this.marketIndexModel.findById(id);
  }

  private analystic(data: IHistoryFMPSymbol[], currentPrice: number): IHistoryFMPSymbolAnalyst {
    const analized: IHistoryFMPSymbolAnalyst = {
      avgClosePrice: 0,
      sessions: 0,
      rateOnAvg: this.RATE_VIA_AVG,
      suggest: 'no_suggest',
      from: '',
      to: '',
      currentPrice: currentPrice,
    };

    if (!data.length) return analized;

    data.forEach((d) => {
      analized.avgClosePrice += d.close;
      analized.sessions++;
    });

    analized.avgClosePrice = Number((analized.avgClosePrice / data.length).toFixed(2));
    analized.from = data[0]?.date || '';
    analized.to = data.at(-1)?.date || '';

    const diffPercentage =
      ((analized.currentPrice - analized.avgClosePrice) / analized.avgClosePrice) * 100;

    if (diffPercentage > 5) {
      analized.suggest = 'sell';
    } else if (diffPercentage <= -5) {
      analized.suggest = 'buy';
    }

    return analized;
  }

  private getSymbol(name: string): string | undefined {
    const symbols = {
      ['dowjones']: '^DJI',
      ['s&p500']: '^GSPC',
      ['nasdaq']: '^IXIC',
    };

    const symbol: string | undefined = symbols[name.toLowerCase().trim().replaceAll(' ', '')];

    if (!symbol) {
      throw new Error(`${name} is not provided`);
    }

    return symbol;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async cronGetIndexes() {
    const indexesSymbol = await this.marketIndexModel.find().select('symbol');
    const symbols = indexesSymbol.map((indexes) => indexes.symbol);

    for (const symbol of symbols) {
      const analizedSymbol = await this.analizeSymbol(symbol);

      console.log({ [symbol]: 'ANALIZED', date: new Date().toLocaleString() });

      this.gateway.sendUpdate(analizedSymbol);
    }
  }
}
