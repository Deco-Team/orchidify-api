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
exports.CourseComboService = exports.ICourseComboService = void 0;
const common_1 = require("@nestjs/common");
const course_repository_1 = require("../repositories/course.repository");
const mongoose_1 = require("mongoose");
const constant_1 = require("../../common/contracts/constant");
const constant_2 = require("../contracts/constant");
const _ = require("lodash");
const constant_3 = require("../../instructor/contracts/constant");
exports.ICourseComboService = Symbol('ICourseComboService');
let CourseComboService = class CourseComboService {
    constructor(courseRepository) {
        this.courseRepository = courseRepository;
    }
    async create(createCourseComboDto, options) {
        createCourseComboDto['code'] = await this.generateCode();
        const courseCombo = await this.courseRepository.create(createCourseComboDto, options);
        return courseCombo;
    }
    async findById(courseId, projection, populates) {
        const course = await this.courseRepository.findOne({
            conditions: {
                _id: courseId,
                childCourseIds: { $ne: [] }
            },
            projection,
            populates
        });
        return course;
    }
    update(conditions, payload, options) {
        return this.courseRepository.findOneAndUpdate(conditions, payload, options);
    }
    async listByInstructor(instructorId, pagination, queryCourseDto, projection = constant_2.COURSE_COMBO_LIST_PROJECTION) {
        const { title } = queryCourseDto;
        const filter = {
            instructorId: new mongoose_1.Types.ObjectId(instructorId),
            status: constant_1.CourseStatus.ACTIVE,
            childCourseIds: { $ne: [] }
        };
        if (title) {
            filter['$text'] = {
                $search: title
            };
        }
        return this.courseRepository.model.paginate(filter, {
            ...pagination,
            projection
        });
    }
    async listByStaff(pagination, queryCourseDto, projection = constant_2.COURSE_COMBO_LIST_PROJECTION) {
        const { title } = queryCourseDto;
        const filter = {
            status: constant_1.CourseStatus.ACTIVE,
            childCourseIds: { $ne: [] }
        };
        if (title) {
            filter['$text'] = {
                $search: title
            };
        }
        return this.courseRepository.model.paginate(filter, {
            ...pagination,
            projection,
            populate: [
                {
                    path: 'instructor',
                    select: constant_3.COURSE_INSTRUCTOR_DETAIL_PROJECTION
                }
            ]
        });
    }
    async findMany(conditions, projection, populates) {
        const courses = await this.courseRepository.findMany({
            conditions: {
                ...conditions,
                childCourseIds: { $ne: [] }
            },
            projection,
            populates
        });
        return courses;
    }
    async generateCode() {
        const prefix = `OCP`;
        const lastRecord = await this.courseRepository.model.findOne().sort({ createdAt: -1 });
        const number = parseInt(_.get(lastRecord, 'code', `${prefix}000`).split(prefix)[1]) + 1;
        return `${prefix}${number.toString().padStart(3, '0')}`;
    }
};
exports.CourseComboService = CourseComboService;
exports.CourseComboService = CourseComboService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(course_repository_1.ICourseRepository)),
    __metadata("design:paramtypes", [Object])
], CourseComboService);
//# sourceMappingURL=course-combo.service.js.map