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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    constructor(appService, healthCheckService, memoryHealthIndicator, mongooseHealthIndicator) {
        this.appService = appService;
        this.healthCheckService = healthCheckService;
        this.memoryHealthIndicator = memoryHealthIndicator;
        this.mongooseHealthIndicator = mongooseHealthIndicator;
    }
    getWelcome() {
        return this.appService.getI18nText();
    }
    healthCheck() {
        return this.healthCheckService.check([
            () => this.mongooseHealthIndicator.pingCheck('mongodb'),
            () => this.memoryHealthIndicator.checkHeap('memory_heap', 150 * 1024 * 1024)
        ]);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('welcome'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getWelcome", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, terminus_1.HealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "healthCheck", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        terminus_1.HealthCheckService,
        terminus_1.MemoryHealthIndicator,
        terminus_1.MongooseHealthIndicator])
], AppController);
//# sourceMappingURL=app.controller.js.map