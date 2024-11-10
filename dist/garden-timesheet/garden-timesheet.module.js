"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardenTimesheetModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const management_garden_timesheet_controller_1 = require("./controllers/management.garden-timesheet.controller");
const garden_module_1 = require("../garden/garden.module");
const garden_timesheet_schema_1 = require("./schemas/garden-timesheet.schema");
const garden_timesheet_service_1 = require("./services/garden-timesheet.service");
const garden_timesheet_repository_1 = require("./repositories/garden-timesheet.repository");
const instructor_garden_timesheet_controller_1 = require("./controllers/instructor.garden-timesheet.controller");
const learner_garden_timesheet_controller_1 = require("./controllers/learner.garden-timesheet.controller");
let GardenTimesheetModule = class GardenTimesheetModule {
};
exports.GardenTimesheetModule = GardenTimesheetModule;
exports.GardenTimesheetModule = GardenTimesheetModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: garden_timesheet_schema_1.GardenTimesheet.name, schema: garden_timesheet_schema_1.GardenTimesheetSchema }]), garden_module_1.GardenModule],
        controllers: [
            management_garden_timesheet_controller_1.ManagementGardenTimesheetController,
            instructor_garden_timesheet_controller_1.InstructorGardenTimesheetController,
            learner_garden_timesheet_controller_1.LearnerGardenTimesheetController
        ],
        providers: [
            {
                provide: garden_timesheet_service_1.IGardenTimesheetService,
                useClass: garden_timesheet_service_1.GardenTimesheetService
            },
            {
                provide: garden_timesheet_repository_1.IGardenTimesheetRepository,
                useClass: garden_timesheet_repository_1.GardenTimesheetRepository
            }
        ],
        exports: [
            {
                provide: garden_timesheet_service_1.IGardenTimesheetService,
                useClass: garden_timesheet_service_1.GardenTimesheetService
            }
        ]
    })
], GardenTimesheetModule);
//# sourceMappingURL=garden-timesheet.module.js.map