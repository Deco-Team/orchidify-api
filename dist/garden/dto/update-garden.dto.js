"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGardenDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_garden_dto_1 = require("./base.garden.dto");
class UpdateGardenDto extends (0, swagger_1.PartialType)((0, swagger_1.PickType)(base_garden_dto_1.BaseGardenDto, ['description', 'images', 'gardenManagerId'])) {
}
exports.UpdateGardenDto = UpdateGardenDto;
//# sourceMappingURL=update-garden.dto.js.map