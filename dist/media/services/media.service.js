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
var MediaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const _ = require("lodash");
const app_exception_1 = require("../../common/exceptions/app.exception");
const error_1 = require("../../common/contracts/error");
const app_logger_service_1 = require("../../common/services/app-logger.service");
let MediaService = MediaService_1 = class MediaService {
    constructor(configService, cloudinary) {
        this.configService = configService;
        this.cloudinary = cloudinary;
        this.appLogger = new app_logger_service_1.AppLogger(MediaService_1.name);
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
            this.appLogger.error(err);
            throw new app_exception_1.AppException(error_1.Errors.UPLOAD_MEDIA_ERROR);
        }
    }
    async generateSignedUrl(params_to_sign) {
        return this.cloudinary.utils.api_sign_request(params_to_sign, this.configService.get('cloudinary.api_secret'));
    }
    async uploadMultiple(images) {
        const uploadPromises = [];
        images.forEach((image) => {
            uploadPromises.push(this.cloudinary.uploader.upload(image));
        });
        const uploadResponses = await Promise.all(uploadPromises);
        this.appLogger.log(JSON.stringify(uploadResponses));
        return uploadResponses;
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = MediaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('CLOUDINARY_V2')),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], MediaService);
//# sourceMappingURL=media.service.js.map