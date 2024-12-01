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
exports.PayoutRequestSchema = exports.PayoutRequest = exports.PayoutRequestStatusHistory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
const instructor_schema_1 = require("../../instructor/schemas/instructor.schema");
const staff_schema_1 = require("../../staff/schemas/staff.schema");
const transaction_schema_1 = require("../../transaction/schemas/transaction.schema");
const base_media_dto_1 = require("../../media/dto/base-media.dto");
class PayoutRequestStatusHistory {
}
exports.PayoutRequestStatusHistory = PayoutRequestStatusHistory;
__decorate([
    (0, mongoose_1.Prop)({ enum: constant_1.PayoutRequestStatus, required: true }),
    __metadata("design:type", String)
], PayoutRequestStatusHistory.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], PayoutRequestStatusHistory.prototype, "timestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PayoutRequestStatusHistory.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: constant_1.UserRole }),
    __metadata("design:type", String)
], PayoutRequestStatusHistory.prototype, "userRole", void 0);
let PayoutRequest = class PayoutRequest {
    constructor(id) {
        this._id = id;
    }
};
exports.PayoutRequest = PayoutRequest;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], PayoutRequest.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], PayoutRequest.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: constant_1.PayoutRequestStatus,
        default: constant_1.PayoutRequestStatus.PENDING
    }),
    __metadata("design:type", String)
], PayoutRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], PayoutRequest.prototype, "rejectReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [PayoutRequestStatusHistory]
    }),
    __metadata("design:type", Array)
], PayoutRequest.prototype, "histories", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], PayoutRequest.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: instructor_schema_1.Instructor.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PayoutRequest.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: staff_schema_1.Staff.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PayoutRequest.prototype, "handledBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: transaction_schema_1.Transaction.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PayoutRequest.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean }),
    __metadata("design:type", Boolean)
], PayoutRequest.prototype, "hasMadePayout", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], PayoutRequest.prototype, "transactionCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: base_media_dto_1.BaseMediaDto }),
    __metadata("design:type", base_media_dto_1.BaseMediaDto)
], PayoutRequest.prototype, "attachments", void 0);
exports.PayoutRequest = PayoutRequest = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'payout-requests',
        timestamps: {
            createdAt: true,
            updatedAt: true
        },
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            },
            virtuals: true
        }
    }),
    __metadata("design:paramtypes", [String])
], PayoutRequest);
exports.PayoutRequestSchema = mongoose_1.SchemaFactory.createForClass(PayoutRequest);
exports.PayoutRequestSchema.plugin(paginate);
exports.PayoutRequestSchema.index({ createdBy: 1 });
//# sourceMappingURL=payout-request.schema.js.map