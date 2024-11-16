"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCancelClassRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_class_request_dto_1 = require("./base.class-request.dto");
class CreateCancelClassRequestDto extends (0, swagger_1.PickType)(base_class_request_dto_1.BaseClassRequestDto, ['description', 'classId']) {
}
exports.CreateCancelClassRequestDto = CreateCancelClassRequestDto;
//# sourceMappingURL=create-cancel-class-request.dto.js.map