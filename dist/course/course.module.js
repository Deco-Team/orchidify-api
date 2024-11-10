"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const instructor_course_controller_1 = require("./controllers/instructor.course.controller");
const course_service_1 = require("./services/course.service");
const course_session_service_1 = require("./services/course-session.service");
const course_assignment_service_1 = require("./services/course-assignment.service");
const course_repository_1 = require("./repositories/course.repository");
const garden_module_1 = require("../garden/garden.module");
const course_schema_1 = require("./schemas/course.schema");
const management_course_controller_1 = require("./controllers/management.course.controller");
const learner_course_controller_1 = require("./controllers/learner.course.controller");
const instructor_course_combo_controller_1 = require("./controllers/instructor.course-combo.controller");
const course_combo_service_1 = require("./services/course-combo.service");
const management_course_combo_controller_1 = require("./controllers/management.course-combo.controller");
let CourseModule = class CourseModule {
};
exports.CourseModule = CourseModule;
exports.CourseModule = CourseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: course_schema_1.Course.name, schema: course_schema_1.CourseSchema }]), garden_module_1.GardenModule],
        controllers: [
            instructor_course_controller_1.InstructorCourseController,
            management_course_controller_1.ManagementCourseController,
            learner_course_controller_1.CourseController,
            instructor_course_combo_controller_1.InstructorCourseComboController,
            management_course_combo_controller_1.ManagementCourseComboController
        ],
        providers: [
            {
                provide: course_service_1.ICourseService,
                useClass: course_service_1.CourseService
            },
            {
                provide: course_combo_service_1.ICourseComboService,
                useClass: course_combo_service_1.CourseComboService
            },
            {
                provide: course_session_service_1.ICourseSessionService,
                useClass: course_session_service_1.CourseSessionService
            },
            {
                provide: course_assignment_service_1.ICourseAssignmentService,
                useClass: course_assignment_service_1.CourseAssignmentService
            },
            {
                provide: course_repository_1.ICourseRepository,
                useClass: course_repository_1.CourseRepository
            }
        ],
        exports: [
            {
                provide: course_service_1.ICourseService,
                useClass: course_service_1.CourseService
            },
            {
                provide: course_combo_service_1.ICourseComboService,
                useClass: course_combo_service_1.CourseComboService
            }
        ]
    })
], CourseModule);
//# sourceMappingURL=course.module.js.map