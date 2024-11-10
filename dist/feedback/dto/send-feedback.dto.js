"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendFeedbackDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_feedback_dto_1 = require("./base.feedback.dto");
class SendFeedbackDto extends (0, swagger_1.PickType)(base_feedback_dto_1.BaseFeedbackDto, ['rate', 'comment']) {
}
exports.SendFeedbackDto = SendFeedbackDto;
//# sourceMappingURL=send-feedback.dto.js.map