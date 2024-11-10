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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../common/contracts/dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const media_service_1 = require("../services/media.service");
const generate_signed_url_dto_1 = require("../dto/generate-signed-url.dto");
const upload_media_via_base64_dto_1 = require("../dto/upload-media-via-base64.dto");
let MediaController = class MediaController {
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    generateSignedURL(generateSignedUrlDto) {
        return this.mediaService.create(generateSignedUrlDto);
    }
    uploadViaBase64(uploadMediaViaBase64Dto) {
        return this.mediaService.uploadViaBase64(uploadMediaViaBase64Dto);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Generating authentication signatures`
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: generate_signed_url_dto_1.GenerateSignedUrlDataResponse }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_signed_url_dto_1.GenerateSignedUrlDto]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "generateSignedURL", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Upload Media Via Base64`
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: upload_media_via_base64_dto_1.UploadMediaViaBase64DataResponseDto }),
    (0, common_1.Post)('upload/base64'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_media_via_base64_dto_1.UploadMediaViaBase64Dto]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "uploadViaBase64", null);
exports.MediaController = MediaController = __decorate([
    (0, swagger_1.ApiTags)('Media'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map