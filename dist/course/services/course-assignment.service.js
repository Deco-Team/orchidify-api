"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseAssignmentService = exports.ICourseAssignmentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const course_repository_1 = require("../repositories/course.repository");
exports.ICourseAssignmentService = Symbol('ICourseAssignmentService');
let CourseAssignmentService = class CourseAssignmentService {
    constructor(courseRepository) {
        this.courseRepository = courseRepository;
    }
    async findOneBy(params) {
        const { assignmentId, courseId, instructorId } = params;
        const conditions = { _id: courseId };
        if (instructorId)
            conditions['instructorId'] = new mongoose_1.Types.ObjectId(instructorId);
        const course = await this.courseRepository.findOne({
            conditions,
            projection: 'sessions',
            options: { lean: true }
        });
        let assignment;
        for (let session of course.sessions) {
            assignment = session?.assignments?.find((assignment) => assignment._id.toString() === assignmentId);
            if (assignment) {
                assignment['sessionNumber'] = session.sessionNumber;
                break;
            }
        }
        if (!assignment)
            return null;
        return assignment;
    }
};
exports.CourseAssignmentService = CourseAssignmentService;
exports.CourseAssignmentService = CourseAssignmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(course_repository_1.ICourseRepository)),
    __metadata("design:paramtypes", [Object])
], CourseAssignmentService);
//# sourceMappingURL=course-assignment.service.js.map