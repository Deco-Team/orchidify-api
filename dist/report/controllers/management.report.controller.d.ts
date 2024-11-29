/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose-paginate-v2" />
import { IReportService } from '@report/services/report.service';
import { QueryReportByMonthDto, QueryReportByWeekDto } from '@report/dto/view-report.dto';
import { ITransactionService } from '@transaction/services/transaction.service';
export declare class ManagementReportController {
    private readonly reportService;
    private readonly transactionService;
    constructor(reportService: IReportService, transactionService: ITransactionService);
    viewReportTotalSummary(): Promise<{
        docs: (import("mongoose").Document<unknown, {}, import("../schemas/report.schema").Report> & import("../schemas/report.schema").Report & Required<{
            _id: string;
        }>)[];
    }>;
    viewReportUserDataByMonth(queryReportByMonthDto: QueryReportByMonthDto): Promise<{
        docs: any[];
    }>;
    viewReportClassDataByStatus(): Promise<{
        quantity: any;
        docs: {
            status: any;
            quantity: any;
        }[];
    }>;
    adminViewReportTotalSummary(): Promise<{
        docs: (import("mongoose").Document<unknown, {}, import("../schemas/report.schema").Report> & import("../schemas/report.schema").Report & Required<{
            _id: string;
        }>)[];
    }>;
    adminViewReportStaffDataByStatus(): Promise<{
        quantity: any;
        docs: {
            status: any;
            quantity: any;
        }[];
    }>;
    adminViewReportRevenueDataByMonth(queryReportByMonthDto: QueryReportByMonthDto): Promise<{
        docs: any[];
    }>;
    adminViewReportTransactionByDate(queryReportByWeekDto: QueryReportByWeekDto): Promise<{
        docs: any[];
    }>;
}
