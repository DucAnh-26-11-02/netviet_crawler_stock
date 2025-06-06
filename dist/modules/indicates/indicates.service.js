"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicateService = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = require("axios");
const mongoose_2 = require("mongoose");
const crawler_config_1 = require("../../configs/crawler.config");
const indicates_entity_1 = require("../../entities/indicates.entity");
const time_1 = require("../../utils/time");
const indicate_getway_1 = require("./indicate.getway");
let IndicateService = class IndicateService {
    constructor(marketIndexModel, crawlerConfigData, cache, gateway) {
        this.marketIndexModel = marketIndexModel;
        this.crawlerConfigData = crawlerConfigData;
        this.cache = cache;
        this.gateway = gateway;
        this.TTL = 60;
        this.RATE_VIA_AVG = 5;
    }
    async getAll() {
        const data = await this.marketIndexModel.find();
        return data.map((d) => {
            const objectData = d.toObject();
            const res = {
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
    async getIndexes(name) {
        const trimedName = name.trim();
        const symbol = this.getSymbol(trimedName);
        const analizedSymbol = await this.analizeSymbol(symbol);
        this.gateway.sendUpdate(analizedSymbol);
        return analizedSymbol;
    }
    async analizeSymbol(symbol) {
        const cached = await this.cache.get(symbol);
        if (!!cached) {
            return cached;
        }
        const quoteData = await this.getQuote(symbol);
        if (!quoteData) {
            throw new Error(`Failed to crawl ${name} index`);
        }
        const indicate = {
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
        const currentDateObj = (0, time_1.createDateObject)(new Date());
        const toDateObj = (0, time_1.getShiftedDate)(currentDateObj, -1);
        const fromDateObj = (0, time_1.getShiftedDate)(toDateObj, -10);
        const from = (0, time_1.formatDateObject)(fromDateObj, 'YYYY-MM-DD');
        const to = (0, time_1.formatDateObject)(toDateObj, 'YYYY-MM-DD');
        const historyIndexes = await this.getHistory(symbol, from, to);
        const analystic = this.analystic(historyIndexes, indicate.currentPrice);
        const savedIndex = await this.saveData(symbol, indicate);
        const indexObject = savedIndex.toObject();
        indicate.id = indexObject._id.toString();
        const response = {
            ...analystic,
            name: indicate.name,
            symbol,
        };
        await this.cache.set(symbol, response, this.TTL);
        return response;
    }
    async getQuote(symbol) {
        const { apiKey, url } = this.crawlerConfigData;
        const data = await axios_1.default
            .get(`${url}/quote`, {
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
    async getHistory(symbol, from, to) {
        const { apiKey, url } = this.crawlerConfigData;
        const data = await axios_1.default
            .get(`${url}/historical-price-eod/full`, {
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
    async saveData(symbol, data) {
        const isExist = await this.marketIndexModel.findOne({
            symbol,
        });
        let id = null;
        if (isExist) {
            id = isExist._id.toString();
            await this.marketIndexModel.updateOne({ _id: new mongoose_2.Types.ObjectId(id) }, {
                $set: data,
            });
        }
        else {
            const savedRecord = await this.marketIndexModel.create({ ...data, symbol });
            id = savedRecord._id.toString();
        }
        return await this.marketIndexModel.findById(id);
    }
    analystic(data, currentPrice) {
        const analized = {
            avgClosePrice: 0,
            sessions: 0,
            rateOnAvg: this.RATE_VIA_AVG,
            suggest: 'no_suggest',
            from: '',
            to: '',
            currentPrice: currentPrice,
        };
        if (!data.length)
            return analized;
        data.forEach((d) => {
            analized.avgClosePrice += d.close;
            analized.sessions++;
        });
        analized.avgClosePrice = Number((analized.avgClosePrice / data.length).toFixed(2));
        analized.from = data[0]?.date || '';
        analized.to = data.at(-1)?.date || '';
        const diffPercentage = ((analized.currentPrice - analized.avgClosePrice) / analized.avgClosePrice) * 100;
        if (diffPercentage > 5) {
            analized.suggest = 'sell';
        }
        else if (diffPercentage <= -5) {
            analized.suggest = 'buy';
        }
        return analized;
    }
    getSymbol(name) {
        const symbols = {
            ['dowjones']: '^DJI',
            ['s&p500']: '^GSPC',
            ['nasdaq']: '^IXIC',
        };
        const symbol = symbols[name.toLowerCase().trim().replaceAll(' ', '')];
        if (!symbol) {
            throw new Error(`${name} is not provided`);
        }
        return symbol;
    }
    async cronGetIndexes() {
        const indexesSymbol = await this.marketIndexModel.find().select('symbol');
        const symbols = indexesSymbol.map((indexes) => indexes.symbol);
        for (const symbol of symbols) {
            const analizedSymbol = await this.analizeSymbol(symbol);
            console.log({ [symbol]: 'ANALIZED', date: new Date().toLocaleString() });
            this.gateway.sendUpdate(analizedSymbol);
        }
    }
};
exports.IndicateService = IndicateService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IndicateService.prototype, "cronGetIndexes", null);
exports.IndicateService = IndicateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(indicates_entity_1.MarketIndex.name)),
    __param(1, (0, common_1.Inject)(crawler_config_1.default.KEY)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model, void 0, Object, indicate_getway_1.IndicateGetWay])
], IndicateService);
//# sourceMappingURL=indicates.service.js.map