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
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
const _ = require("lodash");
const app_exception_1 = require("../../common/exceptions/app.exception");
const error_1 = require("../../common/contracts/error");
let MediaService = class MediaService {
    constructor(configService) {
        this.configService = configService;
        this.cloudinary = cloudinary_1.v2;
    }
    onModuleInit() {
        const config = this.configService.get('cloudinary');
        this.cloudinary.config({ ...config, secure: true });
    }
    async create(generateSignedUrlDto) {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = await this.generateSignedUrl({
            ...generateSignedUrlDto,
            timestamp
        });
        return { ...generateSignedUrlDto, timestamp, signature };
    }
    async uploadViaBase64(uploadMediaViaBase64Dto) {
        try {
            const result = await this.cloudinary.uploader.upload(`data:image/png;base64,${uploadMediaViaBase64Dto.contents}`, {
                ..._.pick(['type', 'public_id', 'folder'])
            });
            return result;
        }
        catch (err) {
            console.error(err);
            throw new app_exception_1.AppException(error_1.Errors.UPLOAD_MEDIA_ERROR);
        }
    }
    async generateSignedUrl(params_to_sign) {
        return this.cloudinary.utils.api_sign_request(params_to_sign, this.configService.get('cloudinary.api_secret'));
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MediaService);
//# sourceMappingURL=media.service.js.map