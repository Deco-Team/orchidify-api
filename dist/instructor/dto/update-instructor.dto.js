"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInstructorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_instructor_dto_1 = require("./base.instructor.dto");
class UpdateInstructorDto extends (0, swagger_1.PickType)(base_instructor_dto_1.BaseInstructorDto, ['name', 'phone', 'dateOfBirth']) {
}
exports.UpdateInstructorDto = UpdateInstructorDto;
//# sourceMappingURL=update-instructor.dto.js.map