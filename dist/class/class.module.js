"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const class_schema_1 = require("./schemas/class.schema");
const class_repository_1 = require("./repositories/class.repository");
const class_service_1 = require("./services/class.service");
const instructor_class_controller_1 = require("./controllers/instructor.class.controller");
const garden_module_1 = require("../garden/garden.module");
const session_service_1 = require("./services/session.service");
const assignment_service_1 = require("./services/assignment.service");
const management_class_controller_1 = require("./controllers/management.class.controller");
const learner_module_1 = require("../learner/learner.module");
const learner_class_controller_1 = require("./controllers/learner.class.controller");
const learner_class_schema_1 = require("./schemas/learner-class.schema");
const learner_class_service_1 = require("./services/learner-class.service");
const learner_class_repository_1 = require("./repositories/learner-class.repository");
const assignment_submission_schema_1 = require("./schemas/assignment-submission.schema");
const assignment_submission_service_1 = require("./services/assignment-submission.service");
const assignment_submission_repository_1 = require("./repositories/assignment-submission.repository");
const instructor_module_1 = require("../instructor/instructor.module");
let ClassModule = class ClassModule {
};
exports.ClassModule = ClassModule;
exports.ClassModule = ClassModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: class_schema_1.Class.name, schema: class_schema_1.ClassSchema },
                { name: learner_class_schema_1.LearnerClass.name, schema: learner_class_schema_1.LearnerClassSchema },
                { name: assignment_submission_schema_1.AssignmentSubmission.name, schema: assignment_submission_schema_1.AssignmentSubmissionSchema }
            ]),
            garden_module_1.GardenModule,
            learner_module_1.LearnerModule,
            instructor_module_1.InstructorModule
        ],
        controllers: [instructor_class_controller_1.InstructorClassController, management_class_controller_1.ManagementClassController, learner_class_controller_1.LearnerClassController],
        providers: [
            {
                provide: class_service_1.IClassService,
                useClass: class_service_1.ClassService
            },
            {
                provide: session_service_1.ISessionService,
                useClass: session_service_1.SessionService
            },
            {
                provide: assignment_service_1.IAssignmentService,
                useClass: assignment_service_1.AssignmentService
            },
            {
                provide: class_repository_1.IClassRepository,
                useClass: class_repository_1.ClassRepository
            },
            {
                provide: learner_class_service_1.ILearnerClassService,
                useClass: learner_class_service_1.LearnerClassService
            },
            {
                provide: learner_class_repository_1.ILearnerClassRepository,
                useClass: learner_class_repository_1.LearnerClassRepository
            },
            {
                provide: assignment_submission_service_1.IAssignmentSubmissionService,
                useClass: assignment_submission_service_1.AssignmentSubmissionService
            },
            {
                provide: assignment_submission_repository_1.IAssignmentSubmissionRepository,
                useClass: assignment_submission_repository_1.AssignmentSubmissionRepository
            }
        ],
        exports: [
            {
                provide: class_service_1.IClassService,
                useClass: class_service_1.ClassService
            },
            {
                provide: learner_class_service_1.ILearnerClassService,
                useClass: learner_class_service_1.LearnerClassService
            },
            {
                provide: assignment_submission_service_1.IAssignmentSubmissionService,
                useClass: assignment_submission_service_1.AssignmentSubmissionService
            }
        ]
    })
], ClassModule);
//# sourceMappingURL=class.module.js.map