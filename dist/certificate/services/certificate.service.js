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
exports.CertificateService = exports.ICertificateService = void 0;
const error_1 = require("../../common/contracts/error");
const app_exception_1 = require("../../common/exceptions/app.exception");
const helper_service_1 = require("../../common/services/helper.service");
const common_1 = require("@nestjs/common");
const constant_1 = require("../contracts/constant");
const certificate_repository_1 = require("../repositories/certificate.repository");
const mongoose_1 = require("mongoose");
exports.ICertificateService = Symbol('ICertificateService');
let CertificateService = class CertificateService {
    constructor(certificateRepository, helperService) {
        this.certificateRepository = certificateRepository;
        this.helperService = helperService;
    }
    async create(createCertificateDto, options) {
        const certificateCode = await this.generateCertificateCode();
        createCertificateDto['code'] = certificateCode;
        const certificate = await this.certificateRepository.create(createCertificateDto, options);
        return certificate;
    }
    async findById(certificateId, projection, populates) {
        const certificate = await this.certificateRepository.findOne({
            conditions: {
                _id: certificateId
            },
            projection,
            populates
        });
        return certificate;
    }
    update(conditions, payload, options) {
        return this.certificateRepository.findOneAndUpdate(conditions, payload, options);
    }
    async list(pagination, queryCertificateDto, projection = constant_1.CERTIFICATE_LIST_PROJECTION) {
        const { ownerId } = queryCertificateDto;
        const filter = {
            ownerId: new mongoose_1.Types.ObjectId(ownerId)
        };
        return this.certificateRepository.model.paginate(filter, {
            ...pagination,
            projection
        });
    }
    async generateCertificateCode(length = 8, startTime = Date.now()) {
        const code = 'OC' + this.helperService.generateRandomString(length);
        const certificate = await this.certificateRepository.findOne({
            conditions: {
                code
            }
        });
        const elapsedTime = Date.now() - startTime;
        if (!certificate)
            return code;
        const isRetry = elapsedTime < 60 * 1000;
        if (isRetry)
            return await this.generateCertificateCode(length, startTime);
        throw new app_exception_1.AppException(error_1.Errors.INTERNAL_SERVER_ERROR);
    }
};
exports.CertificateService = CertificateService;
exports.CertificateService = CertificateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(certificate_repository_1.ICertificateRepository)),
    __metadata("design:paramtypes", [Object, helper_service_1.HelperService])
], CertificateService);
//# sourceMappingURL=certificate.service.js.map