"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
const app_config_1 = require("./configs/app.config");
const crawler_config_1 = require("./configs/crawler.config");
const database_config_1 = require("./configs/database.config");
const redis_config_1 = require("./configs/redis.config");
const database_module_1 = require("./modules/database/database.module");
const indicates_module_1 = require("./modules/indicates/indicates.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default, database_config_1.default, crawler_config_1.default, redis_config_1.default],
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const redisConfig = configService.get('redis');
                    return {
                        store: await (0, cache_manager_redis_yet_1.redisStore)({
                            socket: {
                                host: redisConfig.host,
                                port: redisConfig.port,
                                timeout: 3000,
                            },
                            username: redisConfig.username,
                            password: redisConfig.password,
                        }),
                    };
                },
            }),
            schedule_1.ScheduleModule.forRoot(),
            database_module_1.DatabaseModule,
            indicates_module_1.IndicateModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map