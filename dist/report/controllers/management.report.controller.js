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
let ManagementReportController = class ManagementReportController {
    constructor(reportService, transactionService) {
        this.reportService = reportService;
        this.transactionService = transactionService;
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
        return { docs: reports };
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
exports.ManagementReportController = ManagementReportController = __decorate([
    (0, swagger_1.ApiTags)('Report - Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('management'),
    __param(0, (0, common_1.Inject)(report_service_1.IReportService)),
    __param(1, (0, common_1.Inject)(transaction_service_1.ITransactionService)),
    __metadata("design:paramtypes", [Object, Object])
], ManagementReportController);
//# sourceMappingURL=management.report.controller.js.map