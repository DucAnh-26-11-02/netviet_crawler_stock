"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => ({
    uri: process.env.DB_URI,
    retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS, 10) || 5,
    retryDelay: parseInt(process.env.DB_RETRY_DELAY, 10) || 5000,
}));
//# sourceMappingURL=database.config.js.map