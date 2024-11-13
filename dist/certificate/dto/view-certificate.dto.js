"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateDetailDataResponse = exports.CertificateListDataResponse = exports.QueryCertificateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_certificate_dto_1 = require("./base.certificate.dto");
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const constant_1 = require("../contracts/constant");
class QueryCertificateDto {
}
exports.QueryCertificateDto = QueryCertificateDto;
class CertificateDetailResponse extends (0, swagger_1.PickType)(base_certificate_dto_1.BaseCertificateDto, constant_1.CERTIFICATE_LIST_PROJECTION) {
}
class CertificateListResponse extends (0, openapi_builder_1.PaginateResponse)(CertificateDetailResponse) {
}
class CertificateListDataResponse extends (0, openapi_builder_1.DataResponse)(CertificateListResponse) {
}
exports.CertificateListDataResponse = CertificateListDataResponse;
class CertificateDetailDataResponse extends (0, openapi_builder_1.DataResponse)(CertificateDetailResponse) {
}
exports.CertificateDetailDataResponse = CertificateDetailDataResponse;
//# sourceMappingURL=view-certificate.dto.js.map