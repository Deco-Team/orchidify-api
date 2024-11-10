"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInstructorProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_instructor_dto_1 = require("./base.instructor.dto");
class UpdateInstructorProfileDto extends (0, swagger_1.PartialType)((0, swagger_1.PickType)(base_instructor_dto_1.BaseInstructorDto, ['avatar', 'bio', 'paymentInfo', 'certificates'])) {
}
exports.UpdateInstructorProfileDto = UpdateInstructorProfileDto;
//# sourceMappingURL=update-instructor-profile.dto.js.map