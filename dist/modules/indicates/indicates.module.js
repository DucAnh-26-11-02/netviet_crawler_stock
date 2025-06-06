"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicateModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const indicates_entity_1 = require("../../entities/indicates.entity");
const indicate_getway_1 = require("./indicate.getway");
const indicates_controller_1 = require("./indicates.controller");
const indicates_service_1 = require("./indicates.service");
let IndicateModule = class IndicateModule {
};
exports.IndicateModule = IndicateModule;
exports.IndicateModule = IndicateModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: indicates_entity_1.MarketIndex.name, schema: indicates_entity_1.MarketIndexSchema }])],
        providers: [indicates_service_1.IndicateService, indicate_getway_1.IndicateGetWay],
        controllers: [indicates_controller_1.IndicateController],
    })
], IndicateModule);
//# sourceMappingURL=indicates.module.js.map