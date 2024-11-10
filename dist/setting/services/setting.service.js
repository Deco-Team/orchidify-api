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
exports.SettingService = exports.ISettingService = void 0;
const common_1 = require("@nestjs/common");
const setting_repository_1 = require("../repositories/setting.repository");
exports.ISettingService = Symbol('ISettingService');
let SettingService = class SettingService {
    constructor(settingRepository) {
        this.settingRepository = settingRepository;
    }
    async findById(settingId, projection, populates) {
        const setting = await this.settingRepository.findOne({
            conditions: {
                _id: settingId
            },
            projection,
            populates
        });
        return setting;
    }
    async findByKey(key, projection, populates) {
        const setting = await this.settingRepository.findOne({
            conditions: {
                key
            },
            projection,
            populates
        });
        return setting;
    }
    update(conditions, payload, options) {
        return this.settingRepository.findOneAndUpdate(conditions, payload, options);
    }
};
exports.SettingService = SettingService;
exports.SettingService = SettingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(setting_repository_1.ISettingRepository)),
    __metadata("design:paramtypes", [Object])
], SettingService);
//# sourceMappingURL=setting.service.js.map