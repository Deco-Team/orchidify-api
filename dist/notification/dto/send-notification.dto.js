"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendNotificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_notification_dto_1 = require("./base.notification.dto");
class SendNotificationDto extends (0, swagger_1.PickType)(base_notification_dto_1.BaseNotificationDto, [
    'title',
    'body',
    'data',
    'receiverIds',
    'createdAt'
]) {
}
exports.SendNotificationDto = SendNotificationDto;
//# sourceMappingURL=send-notification.dto.js.map