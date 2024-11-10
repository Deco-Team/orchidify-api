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
exports.DataResponse = exports.PaginateResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
function PaginateResponse(Doc, options) {
    class PaginateResponse {
    }
    __decorate([
        (0, swagger_1.ApiProperty)({
            required: true,
            isArray: true,
            type: Doc,
            description: 'The list of doc.',
            ...options
        }),
        __metadata("design:type", Array)
    ], PaginateResponse.prototype, "docs", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            required: true,
            type: Number,
            example: 10,
            description: 'Total number of documents in collection that match a query.'
        }),
        __metadata("design:type", Number)
    ], PaginateResponse.prototype, "totalDocs", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            required: true,
            type: Number,
            example: 0,
            description: ' Only if specified or default page/offset values were used.'
        }),
        __metadata("design:type", Number)
    ], PaginateResponse.prototype, "offset", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            required: true,
            type: Number,
            example: 10,
            description: 'Limit that was used.'
        }),
        __metadata("design:type", Number)
    ], PaginateResponse.prototype, "limit", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            required: true,
            type: Number,
            example: 10,
            description: 'Total number of pages.'
        }),
        __metadata("design:type", Number)
    ], PaginateResponse.prototype, "totalPages", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            required: false,
            type: Number,
            example: 1,
            description: 'Current page number.'
        }),
        __metadata("design:type", Number)
    ], PaginateResponse.prototype, "page", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            required: false,
            type: Number,
            example: 1,
            description: 'The starting index/serial/chronological number of first document in current page. (Eg: if page=2 and limit=10, then pagingCounter will be 11)'
        }),
        __metadata("design:type", Number)
    ], PaginateResponse.prototype, "pagingCounter", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            required: true,
            type: Boolean,
            example: false,
            description: 'Availability of prev page.'
        }),
        __metadata("design:type", Boolean)
    ], PaginateResponse.prototype, "hasPrevPage", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            required: true,
            type: Boolean,
            example: true,
            description: 'Availability of next page.'
        }),
        __metadata("design:type", Boolean)
    ], PaginateResponse.prototype, "hasNextPage", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            required: true,
            type: Boolean,
            example: null,
            description: 'Previous page number if available or NULL.'
        }),
        __metadata("design:type", Number)
    ], PaginateResponse.prototype, "prevPage", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            required: true,
            type: Boolean,
            example: 2,
            description: 'Next page number if available or NULL.'
        }),
        __metadata("design:type", Number)
    ], PaginateResponse.prototype, "nextPage", void 0);
    return (0, common_1.mixin)(PaginateResponse);
}
exports.PaginateResponse = PaginateResponse;
function DataResponse(Doc, options) {
    class DataResponse {
    }
    __decorate([
        (0, swagger_1.ApiProperty)({
            required: true,
            type: Doc,
            ...options
        }),
        __metadata("design:type", Object)
    ], DataResponse.prototype, "data", void 0);
    return (0, common_1.mixin)(DataResponse);
}
exports.DataResponse = DataResponse;
//# sourceMappingURL=openapi-builder.js.map