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
exports.UserAuth = exports.ErrorResponse = exports.IDDataResponse = exports.IDResponse = exports.SuccessDataResponse = exports.SuccessResponse = exports.PaginationQuery = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const openapi_builder_1 = require("./openapi-builder");
class PaginationQuery {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.PaginationQuery = PaginationQuery;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        description: 'Page number',
        example: 1,
        default: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Object)
], PaginationQuery.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Number,
        description: 'Number of items per page',
        example: 10,
        default: 10
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Object)
], PaginationQuery.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        example: 'createdAt.asc or createdAt.desc_email.asc',
        description: 'sort any fields. format: <strong>field1.asc|desc or field1.asc|desc_field2.asc|desc</strong>'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], PaginationQuery.prototype, "sort", void 0);
class SuccessResponse {
    constructor(success) {
        this.success = success;
    }
}
exports.SuccessResponse = SuccessResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        required: true,
        example: true,
        description: 'The response status.'
    }),
    __metadata("design:type", Boolean)
], SuccessResponse.prototype, "success", void 0);
class SuccessDataResponse extends (0, openapi_builder_1.DataResponse)(SuccessResponse) {
}
exports.SuccessDataResponse = SuccessDataResponse;
class IDResponse {
    constructor(_id) {
        this._id = _id;
    }
}
exports.IDResponse = IDResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        example: true,
        description: 'The _id of resource.'
    }),
    __metadata("design:type", String)
], IDResponse.prototype, "_id", void 0);
class IDDataResponse extends (0, openapi_builder_1.DataResponse)(IDResponse) {
}
exports.IDDataResponse = IDDataResponse;
class ErrorResponse {
}
exports.ErrorResponse = ErrorResponse;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ErrorResponse.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ErrorResponse.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], ErrorResponse.prototype, "data", void 0);
class UserAuth {
}
exports.UserAuth = UserAuth;
//# sourceMappingURL=dto.js.map