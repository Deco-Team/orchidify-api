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
exports.InstructorReportController = void 0;
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
const mongoose_1 = require("mongoose");
let InstructorReportController = class InstructorReportController {
    constructor(reportService) {
        this.reportService = reportService;
    }
    async viewReportTotalSummary(req) {
        const { _id } = _.get(req, 'user');
        let [reports, requestReports] = await Promise.all([
            this.reportService.findMany({
                type: {
                    $in: [constant_2.ReportType.CourseSum, constant_2.ReportType.ClassSum, constant_2.ReportType.RevenueSum]
                },
                tag: constant_2.ReportTag.User,
                ownerId: new mongoose_1.Types.ObjectId(_id)
            }, ['type', 'data']),
            this.reportService.findMany({
                type: {
                    $in: [constant_2.ReportType.ClassRequestSum, constant_2.ReportType.PayoutRequestSum]
                },
                tag: constant_2.ReportTag.User,
                ownerId: new mongoose_1.Types.ObjectId(_id)
            }, ['type', 'data'])
        ]);
        if (!reports) {
            const initReports = [
                {
                    type: constant_2.ReportType.CourseSum,
                    data: {
                        quantity: 0,
                        [`${constant_1.CourseStatus.ACTIVE}`]: {
                            quantity: 0
                        }
                    },
                    tag: constant_2.ReportTag.User,
                    ownerId: new mongoose_1.Types.ObjectId(_id)
                },
                {
                    type: constant_2.ReportType.ClassSum,
                    data: {
                        quantity: 0,
                        [`${constant_1.ClassStatus.PUBLISHED}`]: {
                            quantity: 0
                        },
                        [`${constant_1.ClassStatus.IN_PROGRESS}`]: {
                            quantity: 0
                        },
                        [`${constant_1.ClassStatus.COMPLETED}`]: {
                            quantity: 0
                        },
                        [`${constant_1.ClassStatus.CANCELED}`]: {
                            quantity: 0
                        }
                    },
                    tag: constant_2.ReportTag.User,
                    ownerId: new mongoose_1.Types.ObjectId(_id)
                },
                {
                    type: constant_2.ReportType.RevenueSum,
                    data: {
                        total: 0
                    },
                    tag: constant_2.ReportTag.User,
                    ownerId: new mongoose_1.Types.ObjectId(_id)
                }
            ];
            reports = await this.reportService.createMany(initReports);
        }
        if (!requestReports) {
            const initRequestReports = [
                {
                    type: constant_2.ReportType.ClassRequestSum,
                    data: {
                        quantity: 0,
                        [`${constant_1.ClassRequestStatus.PENDING}`]: {
                            quantity: 0
                        }
                    },
                    tag: constant_2.ReportTag.User,
                    ownerId: new mongoose_1.Types.ObjectId(_id)
                },
                {
                    type: constant_2.ReportType.PayoutRequestSum,
                    data: {
                        quantity: 0,
                        [`${constant_1.PayoutRequestStatus.PENDING}`]: {
                            quantity: 0
                        }
                    },
                    tag: constant_2.ReportTag.User,
                    ownerId: new mongoose_1.Types.ObjectId(_id)
                }
            ];
            requestReports = await this.reportService.createMany(initRequestReports);
        }
        const formatData = [];
        formatData.push(reports[0]?.toObject());
        formatData.push(reports[1].toObject());
        const classRequestSum = requestReports[0].toObject();
        const payoutRequestSum = requestReports[1].toObject();
        formatData.push({
            type: 'RequestSum',
            data: {
                quantity: _.get(classRequestSum, 'data.quantity', 0) + _.get(payoutRequestSum, 'data.quantity', 0),
                PENDING: {
                    quantity: _.get(classRequestSum, 'data.PENDING.quantity', 0) + _.get(payoutRequestSum, 'data.PENDING.quantity', 0)
                }
            }
        });
        formatData.push(reports[2].toObject());
        return { docs: formatData };
    }
    async viewReportClassDataByStatus(req) {
        const { _id } = _.get(req, 'user');
        let report = await this.reportService.findOne({ type: constant_2.ReportType.ClassSum, tag: constant_2.ReportTag.User, ownerId: new mongoose_1.Types.ObjectId(_id) }, ['type', 'data']);
        if (!report) {
            const initReport = {
                type: constant_2.ReportType.ClassSum,
                data: {
                    quantity: 0,
                    [`${constant_1.ClassStatus.PUBLISHED}`]: {
                        quantity: 0
                    },
                    [`${constant_1.ClassStatus.IN_PROGRESS}`]: {
                        quantity: 0
                    },
                    [`${constant_1.ClassStatus.COMPLETED}`]: {
                        quantity: 0
                    },
                    [`${constant_1.ClassStatus.CANCELED}`]: {
                        quantity: 0
                    }
                },
                tag: constant_2.ReportTag.User,
                ownerId: new mongoose_1.Types.ObjectId(_id)
            };
            const reports = await this.reportService.createMany([initReport]);
            report = reports[0];
        }
        return {
            quantity: report.data.quantity,
            docs: Object.keys(_.omit(report.data, ['quantity'])).map((statusKey) => ({
                status: constant_1.ClassStatus[statusKey],
                quantity: report.data[statusKey].quantity
            }))
        };
    }
    async viewReportLearnerEnrolledDataByMonth(req, queryReportByMonthDto) {
        const { _id } = _.get(req, 'user');
        const { year = 2024 } = queryReportByMonthDto;
        let [learnerEnrolledReport] = await this.reportService.findMany({
            type: {
                $in: [constant_2.ReportType.LearnerEnrolledSumByMonth]
            },
            tag: constant_2.ReportTag.User,
            ownerId: new mongoose_1.Types.ObjectId(_id),
            'data.year': year
        }, ['type', 'data']);
        if (!learnerEnrolledReport) {
            const initReport = {
                type: constant_2.ReportType.LearnerEnrolledSumByMonth,
                data: {
                    '1': {
                        quantity: 0
                    },
                    '2': {
                        quantity: 0
                    },
                    '3': {
                        quantity: 0
                    },
                    '4': {
                        quantity: 0
                    },
                    '5': {
                        quantity: 0
                    },
                    '6': {
                        quantity: 0
                    },
                    '7': {
                        quantity: 0
                    },
                    '8': {
                        quantity: 0
                    },
                    '9': {
                        quantity: 0
                    },
                    '10': {
                        quantity: 0
                    },
                    '11': {
                        quantity: 0
                    },
                    '12': {
                        quantity: 0
                    },
                    year: 2024
                },
                tag: constant_2.ReportTag.User,
                ownerId: new mongoose_1.Types.ObjectId(_id)
            };
            const reports = await this.reportService.createMany([initReport]);
            learnerEnrolledReport = reports[0];
        }
        const docs = [];
        if (learnerEnrolledReport) {
            for (let month = 1; month <= 12; month++) {
                const learner = _.get(learnerEnrolledReport.data, `${month}`) || { quantity: 0 };
                docs.push({
                    learner
                });
            }
        }
        return { docs };
    }
    async viewReportRevenueDataByMonth(req, queryReportByMonthDto) {
        const { _id } = _.get(req, 'user');
        const { year = 2024 } = queryReportByMonthDto;
        let [revenueSumByMonth] = await this.reportService.findMany({
            type: {
                $in: [constant_2.ReportType.RevenueSumByMonth]
            },
            tag: constant_2.ReportTag.User,
            ownerId: new mongoose_1.Types.ObjectId(_id),
            'data.year': year
        }, ['type', 'data']);
        if (!revenueSumByMonth) {
            const initReport = {
                type: constant_2.ReportType.RevenueSumByMonth,
                data: {
                    '1': {
                        total: 0
                    },
                    '2': {
                        total: 0
                    },
                    '3': {
                        total: 0
                    },
                    '4': {
                        total: 0
                    },
                    '5': {
                        total: 0
                    },
                    '6': {
                        total: 0
                    },
                    '7': {
                        total: 0
                    },
                    '8': {
                        total: 0
                    },
                    '9': {
                        total: 0
                    },
                    '10': {
                        total: 0
                    },
                    '11': {
                        total: 0
                    },
                    '12': {
                        total: 0
                    },
                    year: 2024
                },
                tag: constant_2.ReportTag.User,
                ownerId: new mongoose_1.Types.ObjectId(_id)
            };
            const reports = await this.reportService.createMany([initReport]);
            revenueSumByMonth = reports[0];
        }
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
};
exports.InstructorReportController = InstructorReportController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Report Data Total Summary`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportTotalSummaryListDataResponse }),
    (0, common_1.Get)('total-summary'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InstructorReportController.prototype, "viewReportTotalSummary", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Report Class Data By Status`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportClassByStatusListDataResponse }),
    (0, common_1.Get)('class-by-status'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InstructorReportController.prototype, "viewReportClassDataByStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Report Learner Enrolled Data By Month`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportUserByMonthListDataResponse }),
    (0, common_1.Get)('learner-enrolled-by-month'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_report_dto_1.QueryReportByMonthDto]),
    __metadata("design:returntype", Promise)
], InstructorReportController.prototype, "viewReportLearnerEnrolledDataByMonth", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Report Revenue Data By Month`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_report_dto_1.ReportRevenueByMonthListDataResponse }),
    (0, common_1.Get)('revenue-by-month'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_report_dto_1.QueryReportByMonthDto]),
    __metadata("design:returntype", Promise)
], InstructorReportController.prototype, "viewReportRevenueDataByMonth", null);
exports.InstructorReportController = InstructorReportController = __decorate([
    (0, swagger_1.ApiTags)('Report - Instructor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.INSTRUCTOR),
    (0, common_1.Controller)('instructor'),
    __param(0, (0, common_1.Inject)(report_service_1.IReportService)),
    __metadata("design:paramtypes", [Object])
], InstructorReportController);
//# sourceMappingURL=instructor.report.controller.js.map