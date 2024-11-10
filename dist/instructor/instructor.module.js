"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const instructor_schema_1 = require("./schemas/instructor.schema");
const instructor_repository_1 = require("./repositories/instructor.repository");
const instructor_service_1 = require("./services/instructor.service");
const instructor_controller_1 = require("./controllers/instructor.controller");
const management_instructor_controller_1 = require("./controllers/management.instructor.controller");
const learner_instructor_controller_1 = require("./controllers/learner.instructor.controller");
const recruitment_module_1 = require("../recruitment/recruitment.module");
let InstructorModule = class InstructorModule {
};
exports.InstructorModule = InstructorModule;
exports.InstructorModule = InstructorModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: instructor_schema_1.Instructor.name, schema: instructor_schema_1.InstructorSchema }]), recruitment_module_1.RecruitmentModule],
        controllers: [instructor_controller_1.InstructorController, management_instructor_controller_1.ManagementInstructorController, learner_instructor_controller_1.LearnerInstructorController],
        providers: [
            {
                provide: instructor_service_1.IInstructorService,
                useClass: instructor_service_1.InstructorService
            },
            {
                provide: instructor_repository_1.IInstructorRepository,
                useClass: instructor_repository_1.InstructorRepository
            }
        ],
        exports: [
            {
                provide: instructor_service_1.IInstructorService,
                useClass: instructor_service_1.InstructorService
            }
        ]
    })
], InstructorModule);
//# sourceMappingURL=instructor.module.js.map