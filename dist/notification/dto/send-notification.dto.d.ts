import { BaseNotificationDto } from './base.notification.dto';
declare const SendNotificationDto_base: import("@nestjs/common").Type<Pick<BaseNotificationDto, "data" | "body" | "createdAt" | "title" | "receiverIds">>;
export declare class SendNotificationDto extends SendNotificationDto_base {
}
export {};
