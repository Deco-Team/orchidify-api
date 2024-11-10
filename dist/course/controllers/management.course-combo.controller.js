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
exports.ManagementCourseComboController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../common/contracts/dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const constant_1 = require("../../common/contracts/constant");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const app_exception_1 = require("../../common/exceptions/app.exception");
const error_1 = require("../../common/contracts/error");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const pagination_decorator_1 = require("../../common/decorators/pagination.decorator");
const constant_2 = require("../contracts/constant");
const constant_3 = require("../../instructor/contracts/constant");
const course_combo_service_1 = require("../services/course-combo.service");
const view_course_combo_dto_1 = require("../dto/view-course-combo.dto");
let ManagementCourseComboController = class ManagementCourseComboController {
    constructor(courseComboService) {
        this.courseComboService = courseComboService;
    }
    async list(pagination, queryCourseDto) {
        return await this.courseComboService.listByStaff(pagination, queryCourseDto);
    }
    async getDetail(courseId) {
        const courseCombo = await this.courseComboService.findById(courseId, constant_2.COURSE_COMBO_DETAIL_PROJECTION, [
            {
                path: 'instructor',
                select: constant_3.COURSE_INSTRUCTOR_DETAIL_PROJECTION
            },
            {
                path: 'childCourses',
                select: constant_2.CHILD_COURSE_COMBO_DETAIL_PROJECTION
            }
        ]);
        if (!courseCombo || [constant_1.CourseStatus.ACTIVE].includes(courseCombo.status) === false)
            throw new app_exception_1.AppException(error_1.Errors.COURSE_COMBO_NOT_FOUND);
        return courseCombo;
    }
};
exports.ManagementCourseComboController = ManagementCourseComboController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Course Combo List`
    }),
    (0, swagger_1.ApiQuery)({ type: dto_1.PaginationQuery }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_combo_dto_1.StaffViewCourseComboListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)('combo'),
    __param(0, (0, pagination_decorator_1.Pagination)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_course_combo_dto_1.StaffQueryCourseComboDto]),
    __metadata("design:returntype", Promise)
], ManagementCourseComboController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Course Combo Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_course_combo_dto_1.StaffViewCourseComboDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.COURSE_COMBO_NOT_FOUND]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)('combo/:id([0-9a-f]{24})'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagementCourseComboController.prototype, "getDetail", null);
exports.ManagementCourseComboController = ManagementCourseComboController = __decorate([
    (0, swagger_1.ApiTags)('CourseCombo - Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('management'),
    __param(0, (0, common_1.Inject)(course_combo_service_1.ICourseComboService)),
    __metadata("design:paramtypes", [Object])
], ManagementCourseComboController);
//# sourceMappingURL=management.course-combo.controller.js.map