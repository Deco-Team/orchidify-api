"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCertificateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_certificate_dto_1 = require("./base.certificate.dto");
class CreateCertificateDto extends (0, swagger_1.PickType)(base_certificate_dto_1.BaseCertificateDto, ['code', 'name', 'url', 'ownerId']) {
}
exports.CreateCertificateDto = CreateCertificateDto;
//# sourceMappingURL=create-certificate.dto.js.map