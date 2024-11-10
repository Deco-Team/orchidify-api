"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStaffDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_staff_dto_1 = require("./base.staff.dto");
class CreateStaffDto extends (0, swagger_1.PickType)(base_staff_dto_1.BaseStaffDto, ['name', 'email', 'idCardPhoto']) {
}
exports.CreateStaffDto = CreateStaffDto;
//# sourceMappingURL=create-staff.dto.js.map