"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const setting_service_1 = require("./services/setting.service");
const setting_repository_1 = require("./repositories/setting.repository");
const garden_module_1 = require("../garden/garden.module");
const setting_schema_1 = require("./schemas/setting.schema");
const setting_controller_1 = require("./controllers/setting.controller");
let SettingModule = class SettingModule {
};
exports.SettingModule = SettingModule;
exports.SettingModule = SettingModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: setting_schema_1.Setting.name, schema: setting_schema_1.SettingSchema }]), garden_module_1.GardenModule],
        controllers: [setting_controller_1.SettingController],
        providers: [
            {
                provide: setting_service_1.ISettingService,
                useClass: setting_service_1.SettingService
            },
            {
                provide: setting_repository_1.ISettingRepository,
                useClass: setting_repository_1.SettingRepository
            }
        ],
        exports: [
            {
                provide: setting_service_1.ISettingService,
                useClass: setting_service_1.SettingService
            }
        ]
    })
], SettingModule);
//# sourceMappingURL=setting.module.js.map