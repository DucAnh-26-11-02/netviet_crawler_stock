"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('crawler', () => ({
    apiKey: process.env.FMP_API_KEY || '',
    url: process.env.FMP_URL || 'https://financialmodelingprep.com/stable',
}));
//# sourceMappingURL=crawler.config.js.map