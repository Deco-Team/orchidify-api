import { BaseSettingDto } from './base.setting.dto';
import { SettingKey } from '@setting/contracts/constant';
export declare class QuerySettingDto {
    key: SettingKey;
}
declare class SettingListItemResponse extends BaseSettingDto {
}
declare const SettingListResponse_base: import("@nestjs/common").Type<{
    docs: (typeof SettingListItemResponse)[];
    totalDocs: number;
    offset: number;
    limit: number;
    totalPages: number;
    page?: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage?: number;
    nextPage?: number;
}>;
declare class SettingListResponse extends SettingListResponse_base {
}
declare const SettingListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof SettingListResponse;
}>;
export declare class SettingListDataResponse extends SettingListDataResponse_base {
}
declare class SettingDetailResponse extends BaseSettingDto {
}
declare const SettingDetailDataResponse_base: import("@nestjs/common").Type<{
    data: typeof SettingDetailResponse;
}>;
export declare class SettingDetailDataResponse extends SettingDetailDataResponse_base {
}
declare class CourseTypeSettingDetailResponse {
    groupName: string;
    groupItems: string[];
}
declare class CourseTypesSettingDetailResponse {
    docs: CourseTypeSettingDetailResponse[];
}
declare const CourseTypesSettingDetailDataResponse_base: import("@nestjs/common").Type<{
    data: typeof CourseTypesSettingDetailResponse;
}>;
export declare class CourseTypesSettingDetailDataResponse extends CourseTypesSettingDetailDataResponse_base {
}
export {};
