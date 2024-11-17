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
exports.SubscribeFirebaseTopicDto = exports.SendFirebaseTopicMessagingDto = exports.SendFirebaseMulticastMessagingDto = exports.SendFirebaseMessagingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SendFirebaseMessagingDto {
}
exports.SendFirebaseMessagingDto = SendFirebaseMessagingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SendFirebaseMessagingDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SendFirebaseMessagingDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SendFirebaseMessagingDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    __metadata("design:type", Object)
], SendFirebaseMessagingDto.prototype, "data", void 0);
class SendFirebaseMulticastMessagingDto {
}
exports.SendFirebaseMulticastMessagingDto = SendFirebaseMulticastMessagingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, isArray: true }),
    __metadata("design:type", Array)
], SendFirebaseMulticastMessagingDto.prototype, "tokens", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SendFirebaseMulticastMessagingDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SendFirebaseMulticastMessagingDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    __metadata("design:type", Object)
], SendFirebaseMulticastMessagingDto.prototype, "data", void 0);
class SendFirebaseTopicMessagingDto {
}
exports.SendFirebaseTopicMessagingDto = SendFirebaseTopicMessagingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SendFirebaseTopicMessagingDto.prototype, "topic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SendFirebaseTopicMessagingDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SendFirebaseTopicMessagingDto.prototype, "body", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: Object }),
    __metadata("design:type", Object)
], SendFirebaseTopicMessagingDto.prototype, "data", void 0);
class SubscribeFirebaseTopicDto {
}
exports.SubscribeFirebaseTopicDto = SubscribeFirebaseTopicDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String }),
    __metadata("design:type", String)
], SubscribeFirebaseTopicDto.prototype, "topic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, isArray: true }),
    __metadata("design:type", Array)
], SubscribeFirebaseTopicDto.prototype, "tokens", void 0);
//# sourceMappingURL=firebase-messaging.dto.js.map