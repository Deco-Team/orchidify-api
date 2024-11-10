"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewSessionDetailDataResponse = void 0;
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const session_dto_1 = require("./session.dto");
class ViewSessionDetailResponse extends session_dto_1.BaseSessionDto {
}
class ViewSessionDetailDataResponse extends (0, openapi_builder_1.DataResponse)(ViewSessionDetailResponse) {
}
exports.ViewSessionDetailDataResponse = ViewSessionDetailDataResponse;
//# sourceMappingURL=view-session.dto.js.map