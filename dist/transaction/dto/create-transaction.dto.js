"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTransactionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const base_transaction_dto_1 = require("./base.transaction.dto");
class CreateTransactionDto extends (0, swagger_1.PickType)(base_transaction_dto_1.BaseTransactionDto, [
    'type',
    'paymentMethod',
    'amount',
    'debitAccount',
    'creditAccount',
    'description',
    'status',
    'payment',
    'payout'
]) {
}
exports.CreateTransactionDto = CreateTransactionDto;
//# sourceMappingURL=create-transaction.dto.js.map