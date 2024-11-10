"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearnerModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const learner_schema_1 = require("./schemas/learner.schema");
const learner_repository_1 = require("./repositories/learner.repository");
const learner_service_1 = require("./services/learner.service");
const learner_controller_1 = require("./controllers/learner.controller");
const management_learner_controller_1 = require("./controllers/management.learner.controller");
const instructor_learner_controller_1 = require("./controllers/instructor.learner.controller");
let LearnerModule = class LearnerModule {
};
exports.LearnerModule = LearnerModule;
exports.LearnerModule = LearnerModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: learner_schema_1.Learner.name, schema: learner_schema_1.LearnerSchema }])],
        controllers: [learner_controller_1.LearnerController, management_learner_controller_1.ManagementLearnerController, instructor_learner_controller_1.InstructorLearnerController],
        providers: [
            {
                provide: learner_service_1.ILearnerService,
                useClass: learner_service_1.LearnerService
            },
            {
                provide: learner_repository_1.ILearnerRepository,
                useClass: learner_repository_1.LearnerRepository
            }
        ],
        exports: [
            {
                provide: learner_service_1.ILearnerService,
                useClass: learner_service_1.LearnerService
            }
        ]
    })
], LearnerModule);
//# sourceMappingURL=learner.module.js.map