"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStaffDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_staff_dto_1 = require("./base.staff.dto");
class UpdateStaffDto extends (0, swagger_1.PickType)(base_staff_dto_1.BaseStaffDto, ['name']) {
}
exports.UpdateStaffDto = UpdateStaffDto;
//# sourceMappingURL=update-staff.dto.js.map