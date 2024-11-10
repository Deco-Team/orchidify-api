"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardenModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const garden_schema_1 = require("./schemas/garden.schema");
const garden_repository_1 = require("./repositories/garden.repository");
const garden_service_1 = require("./services/garden.service");
const management_garden_manager_controller_1 = require("./controllers/management.garden-manager.controller");
const garden_manager_module_1 = require("../garden-manager/garden-manager.module");
const learner_garden_manager_controller_1 = require("./controllers/learner.garden-manager.controller");
let GardenModule = class GardenModule {
};
exports.GardenModule = GardenModule;
exports.GardenModule = GardenModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: garden_schema_1.Garden.name, schema: garden_schema_1.GardenSchema }]), garden_manager_module_1.GardenManagerModule],
        controllers: [management_garden_manager_controller_1.ManagementGardenController, learner_garden_manager_controller_1.LearnerGardenController],
        providers: [
            {
                provide: garden_service_1.IGardenService,
                useClass: garden_service_1.GardenService
            },
            {
                provide: garden_repository_1.IGardenRepository,
                useClass: garden_repository_1.GardenRepository
            }
        ],
        exports: [
            {
                provide: garden_service_1.IGardenService,
                useClass: garden_service_1.GardenService
            },
            {
                provide: garden_repository_1.IGardenRepository,
                useClass: garden_repository_1.GardenRepository
            }
        ]
    })
], GardenModule);
//# sourceMappingURL=garden.module.js.map