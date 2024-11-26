import { ReportType } from '@report/contracts/constant';
export declare class BaseReportDto {
    _id: string;
    type: ReportType;
    data: Record<string, any>;
}
