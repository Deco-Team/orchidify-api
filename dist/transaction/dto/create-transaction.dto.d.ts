import { BaseTransactionDto } from './base.transaction.dto';
declare const CreateTransactionDto_base: import("@nestjs/common").Type<Pick<BaseTransactionDto, "status" | "type" | "description" | "amount" | "paymentMethod" | "debitAccount" | "creditAccount" | "payment" | "payout">>;
export declare class CreateTransactionDto extends CreateTransactionDto_base {
}
export {};
