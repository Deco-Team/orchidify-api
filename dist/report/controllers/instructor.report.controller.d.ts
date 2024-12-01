import { IReportService } from '@report/services/report.service';
import { QueryReportByMonthDto, QueryReportByWeekDto } from '@report/dto/view-report.dto';
import { ITransactionService } from '@transaction/services/transaction.service';
export declare class InstructorReportController {
    private readonly reportService;
    private readonly transactionService;
    constructor(reportService: IReportService, transactionService: ITransactionService);
    viewReportTotalSummary(req: any): Promise<{
        docs: any[];
    }>;
    viewReportClassDataByStatus(req: any): Promise<{
        quantity: any;
        docs: {
            status: any;
            quantity: any;
        }[];
    }>;
    viewReportLearnerEnrolledDataByMonth(req: any, queryReportByMonthDto: QueryReportByMonthDto): Promise<{
        docs: any[];
    }>;
    viewReportRevenueDataByMonth(req: any, queryReportByMonthDto: QueryReportByMonthDto): Promise<{
        docs: any[];
    }>;
    viewReportTransactionCountByMonth(req: any, queryReportByMonthDto: QueryReportByMonthDto): Promise<{
        docs: {
            _id: any;
            quantity: any;
            month: any;
        }[];
    }>;
    viewReportTransactionByDate(req: any, queryReportByWeekDto: QueryReportByWeekDto): Promise<{
        docs: any[];
    }>;
}
