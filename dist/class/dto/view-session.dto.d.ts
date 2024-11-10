import { BaseSessionDto } from './session.dto';
declare class ViewSessionDetailResponse extends BaseSessionDto {
}
declare const ViewSessionDetailDataResponse_base: import("@nestjs/common").Type<{
    data: typeof ViewSessionDetailResponse;
}>;
export declare class ViewSessionDetailDataResponse extends ViewSessionDetailDataResponse_base {
}
export {};
