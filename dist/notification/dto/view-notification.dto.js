"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationListDataResponse = exports.QueryNotificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const base_notification_dto_1 = require("./base.notification.dto");
const base_learner_dto_1 = require("../../learner/dto/base.learner.dto");
const constant_1 = require("../contracts/constant");
class QueryNotificationDto {
}
exports.QueryNotificationDto = QueryNotificationDto;
class NotificationLearnerDetailResponse extends (0, swagger_1.PickType)(base_learner_dto_1.BaseLearnerDto, ['_id', 'name', 'avatar']) {
}
class NotificationListItemResponse extends (0, swagger_1.PickType)(base_notification_dto_1.BaseNotificationDto, constant_1.NOTIFICATION_LIST_PROJECTION) {
}
class NotificationListResponse {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: NotificationListItemResponse, isArray: true }),
    __metadata("design:type", Array)
], NotificationListResponse.prototype, "docs", void 0);
class NotificationListDataResponse extends (0, openapi_builder_1.DataResponse)(NotificationListResponse) {
}
exports.NotificationListDataResponse = NotificationListDataResponse;
//# sourceMappingURL=view-notification.dto.js.map