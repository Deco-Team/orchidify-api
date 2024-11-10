"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClassRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_class_request_dto_1 = require("./base.class-request.dto");
class UpdateClassRequestDto extends (0, swagger_1.PartialType)((0, swagger_1.PickType)(base_class_request_dto_1.BaseClassRequestDto, ['type', 'description'])) {
}
exports.UpdateClassRequestDto = UpdateClassRequestDto;
//# sourceMappingURL=update-class-request.dto.js.map