"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewCourseSessionDetailDataResponse = void 0;
const openapi_builder_1 = require("../../common/contracts/openapi-builder");
const session_dto_1 = require("../../class/dto/session.dto");
class ViewCourseSessionDetailResponse extends session_dto_1.BaseSessionDto {
}
class ViewCourseSessionDetailDataResponse extends (0, openapi_builder_1.DataResponse)(ViewCourseSessionDetailResponse) {
}
exports.ViewCourseSessionDetailDataResponse = ViewCourseSessionDetailDataResponse;
//# sourceMappingURL=view-course-session.dto.js.map