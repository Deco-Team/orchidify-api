"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardenManagerModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const garden_manager_schema_1 = require("./schemas/garden-manager.schema");
const garden_manager_repository_1 = require("./repositories/garden-manager.repository");
const garden_manager_service_1 = require("./services/garden-manager.service");
const management_garden_manager_controller_1 = require("./controllers/management.garden-manager.controller");
let GardenManagerModule = class GardenManagerModule {
};
exports.GardenManagerModule = GardenManagerModule;
exports.GardenManagerModule = GardenManagerModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: garden_manager_schema_1.GardenManager.name, schema: garden_manager_schema_1.GardenManagerSchema }])],
        controllers: [management_garden_manager_controller_1.ManagementGardenManagerController],
        providers: [
            {
                provide: garden_manager_service_1.IGardenManagerService,
                useClass: garden_manager_service_1.GardenManagerService
            },
            {
                provide: garden_manager_repository_1.IGardenManagerRepository,
                useClass: garden_manager_repository_1.GardenManagerRepository
            }
        ],
        exports: [
            {
                provide: garden_manager_service_1.IGardenManagerService,
                useClass: garden_manager_service_1.GardenManagerService
            }
        ]
    })
], GardenManagerModule);
//# sourceMappingURL=garden-manager.module.js.map