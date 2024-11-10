import { BaseTransactionDto } from './base.transaction.dto';
declare const CreateTransactionDto_base: import("@nestjs/common").Type<Pick<BaseTransactionDto, "type" | "description" | "status" | "amount" | "paymentMethod" | "debitAccount" | "creditAccount" | "payment" | "payout">>;
export declare class CreateTransactionDto extends CreateTransactionDto_base {
}
export {};
