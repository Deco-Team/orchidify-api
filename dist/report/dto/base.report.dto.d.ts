import { ReportTag, ReportType } from '@report/contracts/constant';
export declare class BaseReportDto {
    _id: string;
    type: ReportType;
    tag: ReportTag;
    ownerId: string;
    data: Record<string, any>;
}
