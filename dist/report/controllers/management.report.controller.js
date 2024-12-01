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
exports.ManagementReportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const dto_1 = require("../../common/contracts/dto");
const report_service_1 = require("../services/report.service");
const view_report_dto_1 = require("../dto/view-report.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const constant_1 = require("../../common/contracts/constant");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const constant_2 = require("../contracts/constant");
const config_1 = require("../../config");
const moment = require("moment-timezone");
const transaction_service_1 = require("../../transaction/services/transaction.service");
const course_service_1 = require("../../course/services/course.service");
const class_service_1 = require("../../class/services/class.service");
let ManagementReportController = class ManagementReportController {
    constructor(reportService, transactionService, courseService, classService) {
        this.reportService = reportService;
        this.transactionService = transactionService;
        this.courseService = courseService;
        this.classService = classService;
    }
    async viewReportTotalSummary() {
        const reports = await this.reportService.findMany({
            type: {
                $in: [constant_2.ReportType.CourseSum, constant_2.ReportType.LearnerSum, constant_2.ReportType.InstructorSum, constant_2.ReportType.CourseComboSum]
            },
            tag: constant_2.ReportTag.System
        }, ['type', 'data']);
        return { docs: reports };
    }
    async viewReportUserDataByMonth(queryReportByMonthDto) {
        const { year = 2024 } = queryReportByMonthDto;
        const reports = await this.reportService.findMany({
            type: {
                $in: [constant_2.ReportType.LearnerSumByMonth, constant_2.ReportType.InstructorSumByMonth]
            },
            tag: constant_2.ReportTag.System,
            'data.year': year
        }, ['type', 'data']);
        const learnerReport = _.find(reports, { type: constant_2.ReportType.LearnerSumByMonth });
        const instructorReport = _.find(reports, { type: constant_2.ReportType.InstructorSumByMonth });
        const docs = [];
        if (learnerReport && instructorReport) {
            for (let month = 1; month <= 12; month++) {
                const learner = _.get(learnerReport.data, `${month}`) || { quantity: 0 };
                const instructor = _.get(instructorReport.data, `${month}`) || { quantity: 0 };
                docs.push({
                    learner,
                    instructor
                });
            }
        }
        return { docs };
    }
    async viewReportClassDataByStatus() {
        const report = await this.reportService.findOne({ type: constant_2.ReportType.ClassSum, tag: constant_2.ReportTag.System }, [
            'type',
            'data'
        ]);
        return {
            quantity: report.data.quantity,
            docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
                status: constant_1.ClassStatus[statusKey],
                quantity: report.data[statusKey].quantity
            }))
        };
    }
    async adminViewReportTotalSummary() {
        const reports = await this.reportService.findMany({
            type: {
                $in: [constant_2.ReportType.CourseSum, constant_2.ReportType.LearnerSum, constant_2.ReportType.InstructorSum, constant_2.ReportType.RevenueSum]
            },
            tag: constant_2.ReportTag.System
        }, ['type', 'data']);
        return { docs: reports };
    }
    async adminViewReportStaffDataByStatus() {
        const report = await this.reportService.findOne({ type: constant_2.ReportType.StaffSum, tag: constant_2.ReportTag.System }, [
            'type',
            'data'
        ]);
        return {
            quantity: report.data.quantity,
            docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
                status: constant_1.StaffStatus[statusKey],
                quantity: report.data[statusKey].quantity
            }))
        };
    }
    async adminViewReportRevenueDataByMonth(queryReportByMonthDto) {
        const { year = 2024 } = queryReportByMonthDto;
        let [revenueSumByMonth] = await this.reportService.findMany({
            type: {
                $in: [constant_2.ReportType.RevenueSumByMonth]
            },
            tag: constant_2.ReportTag.System,
            'data.year': year
        }, ['type', 'data']);
        const docs = [];
        if (revenueSumByMonth) {
            for (let month = 1; month <= 12; month++) {
                const revenue = _.get(revenueSumByMonth.data, `${month}`) || { total: 0 };
                docs.push({
                    revenue
                });
            }
        }
        return { docs };
    }
    async adminViewReportTransactionByDate(queryReportByWeekDto) {
        const { date } = queryReportByWeekDto;
        const dateMoment = moment(date).tz(config_1.VN_TIMEZONE);
        let fromDate, toDate;
        fromDate = dateMoment.clone().startOf('isoWeek').toDate();
        toDate = dateMoment.clone().endOf('isoWeek').toDate();
        const reports = await this.transactionService.viewReportTransactionByDate({ fromDate, toDate });
        return {
            docs: reports.map((report) => {
                return {
                    ...report,
                    date: new Date(_.get(report, '_id'))
                };
            })
        };
    }
    async viewReportCourseDataByMonth(queryReportByMonthDto) {
        const { year = 2024 } = queryReportByMonthDto;
        const reports = await this.reportService.findMany({
            type: {
                $in: [constant_2.ReportType.CourseSumByMonth]
            },
            tag: constant_2.ReportTag.System,
            'data.year': year
        }, ['type', 'data']);
        const courseReport = _.find(reports, { type: constant_2.ReportType.CourseSumByMonth });
        const docs = [];
        if (courseReport) {
            for (let month = 1; month <= 12; month++) {
                const course = _.get(courseReport.data, `${month}`) || { quantity: 0 };
                docs.push({
                    course
                });
            }
        }
        return { docs };
    }
    async viewReportCourseDataByRate() {
        const reports = await this.courseService.viewReportCourseByRate();
        const docs = [];
        const idSet = new Set(reports.map((item) => item._id));
        for (let i = 0; i <= 4; i++) {
            if (idSet.has(i)) {
                docs.push(reports.find((item) => item._id === i));
            }
            else {
                docs.push({
                    _id: i,
                    count: 0
                });
            }
        }
        return { docs };
    }
    async adminViewReportClassDataByStatus() {
        const report = await this.reportService.findOne({ type: constant_2.ReportType.ClassSum, tag: constant_2.ReportTag.System }, [
            'type',
            'data'
        ]);
        return {
            quantity: report.data.quantity,
            docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
                status: constant_1.ClassStatus[statusKey],
                quantity: report.data[statusKey].quantity
            }))
        };
    }
    async viewReportClassDataByRate() {
        const reports = await this.classService.viewReportClassByRate();
        const docs = [];
        const idSet = new Set(reports.map((item) => item._id));
        for (let i = 0; i <= 4; i++) {
            if (idSet.has(i)) {
                docs.push(reports.find((item) => item._id === i));
            }
            else {
                docs.push({
                    _id: i,
                    count: 0
                });
            }
        }
        return { docs };
    }
    async viewReportInstructorDataByMonth(queryReportByMonthDto) {
        const { year = 2024 } = queryReportByMonthDto;
        const reports = await this.reportService.findMany({
            type: {
                $in: [constant_2.ReportType.InstructorSumByMonth]
            },
            tag: constant_2.ReportTag.System,
            'data.year': year
        }, ['type', 'data']);
        const instructorReport = _.find(reports, { type: constant_2.ReportType.InstructorSumByMonth });
        const docs = [];
        if (instructorReport) {
            for (let month = 1; month <= 12; month++) {
                const instructor = _.get(instructorReport.data, `${month}`) || { quantity: 0 };
                docs.push({
                    instructor
                });
            }
        }
        return { docs };
    }
    async adminViewReportInstructorDataByStatus() {
        const report = await this.reportService.findOne({ type: constant_2.ReportType.InstructorSum, tag: constant_2.ReportTag.System }, [
            'type',
            'data'
        ]);
        return {
            quantity: report.data.quantity,
            docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
                status: constant_1.InstructorStatus[statusKey],
                quantity: report.data[statusKey].quantity
            }))
        };
    }
    async viewReportLearnerDataByMonth(queryReportByMonthDto) {
        const { year = 2024 } = queryReportByMonthDto;
        const reports = await this.reportService.findMany({
            type: {
                $in: [constant_2.ReportType.LearnerSumByMonth]
            },
            tag: constant_2.ReportTag.System,
            'data.year': year
        }, ['type', 'data']);
        const learnerReport = _.find(reports, { type: constant_2.ReportType.LearnerSumByMonth });
        const docs = [];
        if (learnerReport) {
            for (let month = 1; month <= 12; month++) {
                const learner = _.get(learnerReport.data, `${month}`) || { quantity: 0 };
                docs.push({
                    learner
                });
            }
        }
        return { docs };
    }
    async adminViewReportLearnerDataByStatus() {
        const report = await this.reportService.findOne({ type: constant_2.ReportType.LearnerSum, tag: constant_2.ReportTag.System }, [
            'type',
            'data'
        ]);
        return {
            quantity: report.data.quantity,
            docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
                status: constant_1.LearnerStatus[statusKey],
                quantity: report.data[statusKey].quantity
            }))
        };
    }
};
exports.ManagementReportController = ManagementReportController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Report Data Total Summary`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportTotalSummaryListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)('total-summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "viewReportTotalSummary", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Report User Data By Month`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportUserByMonthListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)('user-by-month'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [view_report_dto_1.QueryReportByMonthDto]),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "viewReportUserDataByMonth", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] View Report Class Data By Status`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportClassByStatusListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)('class-by-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "viewReportClassDataByStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] View Report Data Total Summary`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportTotalSummaryListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/total-summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "adminViewReportTotalSummary", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] View Report Staff Data By Status`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportStaffByStatusListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/staff-by-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "adminViewReportStaffDataByStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] View Report Revenue Data By Month`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportRevenueByMonthListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/revenue-by-month'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [view_report_dto_1.QueryReportByMonthDto]),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "adminViewReportRevenueDataByMonth", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] View Report Transaction Data By Date`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportTransactionByDateListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/transaction-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [view_report_dto_1.QueryReportByWeekDto]),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "adminViewReportTransactionByDate", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] View Report Course Data By Month`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportCourseByMonthListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/course-by-month'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [view_report_dto_1.QueryReportByMonthDto]),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "viewReportCourseDataByMonth", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] View Report Course Data By Rate`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportCourseByRateListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/course-by-rate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "viewReportCourseDataByRate", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] View Report Class Data By Status`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportClassByStatusListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/class-by-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "adminViewReportClassDataByStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] View Report Class Data By Rate`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportClassByRateListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/class-by-rate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "viewReportClassDataByRate", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] View Report Instructor Data By Month`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportInstructorByMonthListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/instructor-by-month'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [view_report_dto_1.QueryReportByMonthDto]),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "viewReportInstructorDataByMonth", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] View Report Instructor Data By Status`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportInstructorByStatusListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/instructor-by-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "adminViewReportInstructorDataByStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] View Report Learner Data By Month`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportLearnerByMonthListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/learner-by-month'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [view_report_dto_1.QueryReportByMonthDto]),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "viewReportLearnerDataByMonth", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.ADMIN}] View Report Learner Data By Status`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportLearnerByStatusListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.ADMIN),
    (0, common_1.Get)('admin/learner-by-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagementReportController.prototype, "adminViewReportLearnerDataByStatus", null);
exports.ManagementReportController = ManagementReportController = __decorate([
    (0, swagger_1.ApiTags)('Report - Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('management'),
    __param(0, (0, common_1.Inject)(report_service_1.IReportService)),
    __param(1, (0, common_1.Inject)(transaction_service_1.ITransactionService)),
    __param(2, (0, common_1.Inject)(course_service_1.ICourseService)),
    __param(3, (0, common_1.Inject)(class_service_1.IClassService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ManagementReportController);
//# sourceMappingURL=management.report.controller.js.map