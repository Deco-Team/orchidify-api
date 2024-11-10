"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGardenManagerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_garden_manager_dto_1 = require("./base.garden-manager.dto");
class UpdateGardenManagerDto extends (0, swagger_1.PickType)(base_garden_manager_dto_1.BaseGardenManagerDto, ['name']) {
}
exports.UpdateGardenManagerDto = UpdateGardenManagerDto;
//# sourceMappingURL=update-garden-manager.dto.js.map