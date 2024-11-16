import { BaseNotificationDto } from '@notification/dto/base.notification.dto';
export declare class QueryNotificationDto {
}
declare const NotificationListItemResponse_base: import("@nestjs/common").Type<Pick<BaseNotificationDto, "data" | "body" | "createdAt" | "title" | "updatedAt" | "_id">>;
declare class NotificationListItemResponse extends NotificationListItemResponse_base {
}
declare class NotificationListResponse {
    docs: NotificationListItemResponse[];
}
declare const NotificationListDataResponse_base: import("@nestjs/common").Type<{
    data: typeof NotificationListResponse;
}>;
export declare class NotificationListDataResponse extends NotificationListDataResponse_base {
}
export {};
