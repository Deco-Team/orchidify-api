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
exports.CourseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const dto_1 = require("../../common/contracts/dto");
const constant_1 = require("../../common/contracts/constant");
const app_exception_1 = require("../../common/exceptions/app.exception");
const error_1 = require("../../common/contracts/error");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const course_service_1 = require("../services/course.service");
const view_course_dto_1 = require("../dto/view-course.dto");
const constant_2 = require("../contracts/constant");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const constant_3 = require("../../class/contracts/constant");
const constant_4 = require("../../instructor/contracts/constant");
const mongoose_1 = require("mongoose");
const learner_class_service_1 = require("../../class/services/learner-class.service");
let CourseController = class CourseController {
    constructor(courseService, learnerClassService) {
        this.courseService = courseService;
        this.learnerClassService = learnerClassService;
    }
    async list(pagination, queryCourseDto) {
        return await this.courseService.listPublicCourses(pagination, queryCourseDto);
    }
    async listForLearner(req, pagination, queryCourseDto) {
        const userAuth = _.get(req, 'user');
        return await this.courseService.listByLearner(pagination, queryCourseDto, userAuth);
    }
    async listBestSellerCourseForLearner(req, pagination, queryCourseDto) {
        const userAuth = _.get(req, 'user');
        return await this.courseService.listBestSellerCoursesByLearner(pagination, queryCourseDto, userAuth);
    }
    async listRecommendedCourseForLearner(req, pagination, queryCourseDto) {
        const userAuth = _.get(req, 'user');
        return await this.courseService.listRecommendedCoursesByLearner(pagination, queryCourseDto, userAuth);
    }
    async getDetail(req, courseId) {
        const { _id: learnerId } = _.get(req, 'user');
        const [course, learnerClasses] = await Promise.all([
            this.courseService.findById(courseId, constant_2.PUBLIC_COURSE_DETAIL_PROJECTION, [
                {
                    path: 'classes',
                    select: constant_3.PUBLIC_COURSE_CLASS_DETAIL_PROJECTION,
                    match: { status: constant_1.ClassStatus.PUBLISHED },
                    populate: [
                        {
                            path: 'learnerClass',
                            select: ['_id'],
                            match: { learnerId: new mongoose_1.Types.ObjectId(learnerId) }
                        },
                        {
                            path: 'garden',
                            select: ['_id', 'name']
                        }
                    ]
                },
                {
                    path: 'instructor',
                    select: constant_4.COURSE_INSTRUCTOR_DETAIL_PROJECTION
                },
                {
                    path: 'combos',
                    select: ['childCourseIds', 'discount'],
                    match: { status: constant_1.CourseStatus.ACTIVE }
                }
            ]),
            this.learnerClassService.findMany({
                learnerId: new mongoose_1.Types.ObjectId(learnerId)
            })
        ]);
        if (!course || [constant_1.CourseStatus.ACTIVE].includes(course.status) === false)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_NOT_FOUND);
        const learnedCourseIdSet = new Set(learnerClasses.map((learnerClass) => learnerClass.courseId.toString()));
        const courseData = course.toObject();
        const combos = _.get(courseData, 'combos');
        let discount = 0;
        if (combos.length !== 0) {
            const clonedCourseIdSet = new Set([...learnedCourseIdSet]);
            clonedCourseIdSet.delete(course._id.toString());
            for (const combo of combos) {
                const matchedCourseIds = combo.childCourseIds.filter((childCourseId) => {
                    return childCourseId.toString() !== course._id.toString() && clonedCourseIdSet.has(childCourseId.toString());
                });
                if (matchedCourseIds.length > 0) {
                    const newDiscount = combo.discount;
                    discount = newDiscount > discount ? newDiscount : discount;
                }
            }
        }
        _.set(courseData, 'discount', discount);
        _.set(courseData, 'finalPrice', Math.round((_.get(courseData, 'price') * (100 - discount)) / 100));
        _.unset(courseData, 'combos');
        return courseData;
    }
};
exports.CourseController = CourseController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[Viewer] View Public Course List`
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_dto_1.PublishCourseListDataResponse }),
    (0, common_1.Get)(),
    __param(0, (0, pagination_decorator_1.Pagination)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_course_dto_1.PublicQueryCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.LEARNER}] View Course List`
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_dto_1.LearnerViewCourseListDataResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.LEARNER),
    (0, common_1.Get)('learner'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, view_course_dto_1.PublicQueryCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "listForLearner", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.LEARNER}] View Best Seller Course List`
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_dto_1.LearnerViewCourseListDataResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.LEARNER),
    (0, common_1.Get)('learner/best-seller'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, view_course_dto_1.PublicQueryCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "listBestSellerCourseForLearner", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.LEARNER}] View Recommended Course List`
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_dto_1.LearnerViewCourseListDataResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.LEARNER),
    (0, common_1.Get)('learner/recommended'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, pagination_decorator_1.Pagination)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, view_course_dto_1.PublicQueryCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "listRecommendedCourseForLearner", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.LEARNER}] View Course Detail`
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)({ type: view_course_dto_1.LearnerViewCourseDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.COURSE_NOT_FOUND]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.LEARNER),
    (0, common_1.Get)(':id([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getDetail", null);
exports.CourseController = CourseController = __decorate([
    (0, swagger_1.ApiTags)('Course - Viewer/Learner'),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(course_service_1.ICourseService)),
    __param(1, (0, common_1.Inject)(learner_class_service_1.ILearnerClassService)),
    __metadata("design:paramtypes", [Object, Object])
], CourseController);
//# sourceMappingURL=learner.course.controller.js.map