"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInstructorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_instructor_dto_1 = require("./base.instructor.dto");
class CreateInstructorDto extends (0, swagger_1.PickType)(base_instructor_dto_1.BaseInstructorDto, ['name', 'phone', 'dateOfBirth', 'email', 'idCardPhoto']) {
}
exports.CreateInstructorDto = CreateInstructorDto;
//# sourceMappingURL=create-instructor.dto.js.map