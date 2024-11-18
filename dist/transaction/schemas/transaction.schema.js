"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSchema = exports.Transaction = exports.Payout = exports.Payment = exports.TransactionAccount = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
const constant_2 = require("../contracts/constant");
class TransactionAccount {
}
exports.TransactionAccount = TransactionAccount;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TransactionAccount.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: constant_1.UserRole, required: true }),
    __metadata("design:type", String)
], TransactionAccount.prototype, "userRole", void 0);
class Payment {
}
exports.Payment = Payment;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Payment.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Payment.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [Payment]
    }),
    __metadata("design:type", Array)
], Payment.prototype, "histories", void 0);
class Payout {
}
exports.Payout = Payout;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Payout.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Payout.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Payout.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Payout.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [Payout]
    }),
    __metadata("design:type", Array)
], Payout.prototype, "histories", void 0);
let Transaction = class Transaction {
    constructor(id) {
        this._id = id;
    }
};
exports.Transaction = Transaction;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], Transaction.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: constant_2.TransactionType, required: true }),
    __metadata("design:type", String)
], Transaction.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: constant_2.PaymentMethod }),
    __metadata("design:type", String)
], Transaction.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: TransactionAccount }),
    __metadata("design:type", TransactionAccount)
], Transaction.prototype, "debitAccount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: TransactionAccount }),
    __metadata("design:type", TransactionAccount)
], Transaction.prototype, "creditAccount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Transaction.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: constant_1.TransactionStatus, required: true }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Payment }),
    __metadata("design:type", Payment)
], Transaction.prototype, "payment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Payout }),
    __metadata("design:type", Payout)
], Transaction.prototype, "payout", void 0);
exports.Transaction = Transaction = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'transactions',
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            },
            virtuals: true
        }
    }),
    __metadata("design:paramtypes", [String])
], Transaction);
exports.TransactionSchema = mongoose_1.SchemaFactory.createForClass(Transaction);
exports.TransactionSchema.plugin(paginate);
exports.TransactionSchema.virtual('debitAccount.user', {
    ref: 'Learner',
    localField: 'debitAccount.userId',
    foreignField: '_id',
    justOne: true
});
exports.TransactionSchema.virtual('creditAccount.user', {
    ref: 'Instructor',
    localField: 'creditAccount.userId',
    foreignField: '_id',
    justOne: true
});
//# sourceMappingURL=transaction.schema.js.map