import { IReportService } from '@report/services/report.service';
import { QueryReportByMonthDto } from '@report/dto/view-report.dto';
export declare class InstructorReportController {
    private readonly reportService;
    constructor(reportService: IReportService);
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
}
