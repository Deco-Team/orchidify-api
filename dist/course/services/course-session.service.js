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
exports.CourseSessionService = exports.ICourseSessionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const course_repository_1 = require("../repositories/course.repository");
exports.ICourseSessionService = Symbol('ICourseSessionService');
let CourseSessionService = class CourseSessionService {
    constructor(courseRepository) {
        this.courseRepository = courseRepository;
    }
    async findOneBy(params) {
        const { sessionId, courseId, instructorId } = params;
        const conditions = { _id: courseId };
        if (instructorId)
            conditions['instructorId'] = new mongoose_1.Types.ObjectId(instructorId);
        const course = await this.courseRepository.findOne({
            conditions,
            projection: 'sessions',
            options: { lean: true }
        });
        const sessionIndex = course?.sessions?.findIndex((session) => session._id.toString() === sessionId);
        if (sessionIndex === -1)
            return null;
        return course?.sessions[sessionIndex];
    }
};
exports.CourseSessionService = CourseSessionService;
exports.CourseSessionService = CourseSessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(course_repository_1.ICourseRepository)),
    __metadata("design:paramtypes", [Object])
], CourseSessionService);
//# sourceMappingURL=course-session.service.js.map