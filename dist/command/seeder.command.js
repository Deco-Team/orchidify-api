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
var SeederCommand_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederCommand = void 0;
const app_logger_service_1 = require("../common/services/app-logger.service");
const common_1 = require("@nestjs/common");
const setting_service_1 = require("../setting/services/setting.service");
const nest_commander_1 = require("nest-commander");
let SeederCommand = SeederCommand_1 = class SeederCommand extends nest_commander_1.CommandRunner {
    constructor(settingService) {
        super();
        this.settingService = settingService;
        this.appLogger = new app_logger_service_1.AppLogger(SeederCommand_1.name);
    }
    async run(passedParam, options) {
        await this.runWithSettingData();
    }
    async runWithSettingData() {
        this.appLogger.log(`Start Setting Seeder Command`);
        const settingData = require('src/command/data/orchidify-db.settings.json');
        if (settingData.length === 0) {
            this.appLogger.error(`No setting data found`);
            return;
        }
        this.appLogger.log(JSON.stringify(settingData));
        const updateSettingPromise = [];
        for (const setting of settingData) {
            this.appLogger.log(`Key: ${setting.key}`);
            updateSettingPromise.push(this.settingService.update({ key: setting.key }, {
                $set: {
                    key: setting.key,
                    value: setting.value,
                    enabled: setting.enabled
                }
            }, { upsert: true }));
        }
        await Promise.all(updateSettingPromise);
        this.appLogger.log(`Finish Setting Seeder Command`);
    }
};
exports.SeederCommand = SeederCommand;
exports.SeederCommand = SeederCommand = SeederCommand_1 = __decorate([
    (0, nest_commander_1.Command)({ name: 'seed', description: 'A parameter parse' }),
    __param(0, (0, common_1.Inject)(setting_service_1.ISettingService)),
    __metadata("design:paramtypes", [Object])
], SeederCommand);
//# sourceMappingURL=seeder.command.js.map