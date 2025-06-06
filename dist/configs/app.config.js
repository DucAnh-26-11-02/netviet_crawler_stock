"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    env: process.env.NODE_END || 'dev',
    name: 'crawler-stocks',
    port: parseInt(process.env.PORT, 10) || 3000,
    apiPrefix: 'api',
}));
//# sourceMappingURL=app.config.js.map