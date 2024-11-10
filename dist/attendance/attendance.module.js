"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const attendance_schema_1 = require("./schemas/attendance.schema");
const attendance_repository_1 = require("./repositories/attendance.repository");
const attendance_service_1 = require("./services/attendance.service");
const instructor_attendance_controller_1 = require("./controllers/instructor.attendance.controller");
let AttendanceModule = class AttendanceModule {
};
exports.AttendanceModule = AttendanceModule;
exports.AttendanceModule = AttendanceModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: attendance_schema_1.Attendance.name, schema: attendance_schema_1.AttendanceSchema }])],
        controllers: [instructor_attendance_controller_1.InstructorAttendanceController],
        providers: [
            {
                provide: attendance_service_1.IAttendanceService,
                useClass: attendance_service_1.AttendanceService
            },
            {
                provide: attendance_repository_1.IAttendanceRepository,
                useClass: attendance_repository_1.AttendanceRepository
            }
        ],
        exports: [
            {
                provide: attendance_service_1.IAttendanceService,
                useClass: attendance_service_1.AttendanceService
            }
        ]
    })
], AttendanceModule);
//# sourceMappingURL=attendance.module.js.map