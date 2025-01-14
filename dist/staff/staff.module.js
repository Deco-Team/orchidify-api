"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const staff_schema_1 = require("./schemas/staff.schema");
const staff_repository_1 = require("./repositories/staff.repository");
const staff_service_1 = require("./services/staff.service");
const management_staff_controller_1 = require("./controllers/management.staff.controller");
const recruitment_module_1 = require("../recruitment/recruitment.module");
let StaffModule = class StaffModule {
};
exports.StaffModule = StaffModule;
exports.StaffModule = StaffModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: staff_schema_1.Staff.name, schema: staff_schema_1.StaffSchema }]), recruitment_module_1.RecruitmentModule],
        controllers: [management_staff_controller_1.ManagementStaffController],
        providers: [
            {
                provide: staff_service_1.IStaffService,
                useClass: staff_service_1.StaffService
            },
            {
                provide: staff_repository_1.IStaffRepository,
                useClass: staff_repository_1.StaffRepository
            }
        ],
        exports: [
            {
                provide: staff_service_1.IStaffService,
                useClass: staff_service_1.StaffService
            }
        ]
    })
], StaffModule);
//# sourceMappingURL=staff.module.js.map