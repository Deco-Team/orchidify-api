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
exports.ReportService = exports.IReportService = void 0;
const common_1 = require("@nestjs/common");
const report_repository_1 = require("../repositories/report.repository");
exports.IReportService = Symbol('IReportService');
let ReportService = class ReportService {
    constructor(reportRepository) {
        this.reportRepository = reportRepository;
    }
    async findById(reportId, projection, populates) {
        const report = await this.reportRepository.findOne({
            conditions: {
                _id: reportId
            },
            projection,
            populates
        });
        return report;
    }
    async findByType(type, projection, populates) {
        const report = await this.reportRepository.findOne({
            conditions: {
                type
            },
            projection,
            populates
        });
        return report;
    }
    async findOne(conditions, projection, populates) {
        const report = await this.reportRepository.findOne({
            conditions,
            projection,
            populates
        });
        return report;
    }
    update(conditions, payload, options) {
        return this.reportRepository.findOneAndUpdate(conditions, payload, options);
    }
    async findMany(conditions, projection, populates) {
        const reports = await this.reportRepository.findMany({
            conditions,
            projection,
            populates
        });
        return reports;
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(report_repository_1.IReportRepository)),
    __metadata("design:paramtypes", [Object])
], ReportService);
//# sourceMappingURL=report.service.js.map