"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGardenDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_garden_dto_1 = require("./base.garden.dto");
class CreateGardenDto extends (0, swagger_1.PickType)(base_garden_dto_1.BaseGardenDto, [
    'name',
    'description',
    'address',
    'images',
    'maxClass',
    'gardenManagerId'
]) {
}
exports.CreateGardenDto = CreateGardenDto;
//# sourceMappingURL=create-garden.dto.js.map