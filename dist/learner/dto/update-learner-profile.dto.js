"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLearnerProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_learner_dto_1 = require("./base.learner.dto");
class UpdateLearnerProfileDto extends (0, swagger_1.PartialType)((0, swagger_1.PickType)(base_learner_dto_1.BaseLearnerDto, ['name', 'avatar', 'dateOfBirth', 'phone'])) {
}
exports.UpdateLearnerProfileDto = UpdateLearnerProfileDto;
//# sourceMappingURL=update-learner-profile.dto.js.map