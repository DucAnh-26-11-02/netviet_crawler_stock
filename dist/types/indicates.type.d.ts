export interface IIndicate {
    id: string;
    name: string;
    symbol: string;
    currentPrice: number;
    openPrice: number;
    highestPrice: number;
    lowestPrice: number;
    changePercentage: number;
    lastUpdate: number;
}
export interface IIndicateInsight extends IHistoryFMPSymbolAnalyst {
    name: string;
    symbol: string;
}
export interface ISaveIndicate {
    id?: string;
    name: string;
    currentPrice: number;
    openPrice: number;
    highestPrice: number;
    lowestPrice: number;
    lastUpdate: number;
    changePercentage: number;
}
export interface IMarketIndexObject {
    name: string;
    symbol: string;
    currentPrice: number;
    openPrice: number;
    highestPrice: number;
    lowestPrice: number;
    changePercentage: number;
    lastUpdate: number;
}
export interface IQuoteFMPData {
    symbol: string;
    name: string;
    price: number;
    changePercentage: number;
    change: number;
    volume: number;
    dayLow: number;
    dayHigh: number;
    yearHigh: number;
    yearLow: number;
    marketCap: number;
    priceAvg50: number;
    priceAvg200: number;
    exchange: string;
    open: number;
    previousClose: number;
    timestamp: number;
}
export interface IHistoryFMPSymbolAnalyst {
    avgClosePrice: number;
    suggest: 'buy' | 'sell' | 'no_suggest';
    rateOnAvg: number;
    sessions: number;
    from: string;
    to: string;
    currentPrice: number;
}
export interface IHistoryFMPSymbol {
    symbol: string;
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    change: number;
    changePercent: number;
    vwap: number;
}
