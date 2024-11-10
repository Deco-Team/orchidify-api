import { BaseSessionDto } from '@class/dto/session.dto';
declare class ViewCourseSessionDetailResponse extends BaseSessionDto {
}
declare const ViewCourseSessionDetailDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ViewCourseSessionDetailResponse;
}>;
export declare class ViewCourseSessionDetailDataResponse extends ViewCourseSessionDetailDataResponse_base {
}
export {};
