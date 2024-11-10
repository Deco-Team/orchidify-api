"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePayoutRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_payout_request_dto_1 = require("./base.payout-request.dto");
class CreatePayoutRequestDto extends (0, swagger_1.PickType)(base_payout_request_dto_1.BasePayoutRequestDto, ['description', 'amount']) {
}
exports.CreatePayoutRequestDto = CreatePayoutRequestDto;
//# sourceMappingURL=create-payout-request.dto.js.map