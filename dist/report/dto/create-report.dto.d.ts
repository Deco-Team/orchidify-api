import { BaseReportDto } from './base.report.dto';
declare const CreateUserReportDto_base: import("@nestjs/common").Type<Pick<BaseReportDto, "type" | "ownerId" | "tag">>;
export declare class CreateUserReportDto extends CreateUserReportDto_base {
    data: Record<string, any>;
}
export {};
