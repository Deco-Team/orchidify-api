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
exports.InstructorSchema = exports.Instructor = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
const base_instructor_dto_1 = require("../dto/base.instructor.dto");
let Instructor = class Instructor {
    constructor(id) {
        this._id = id;
    }
};
exports.Instructor = Instructor;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], Instructor.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Instructor.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, select: false }),
    __metadata("design:type", String)
], Instructor.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Instructor.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Instructor.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Instructor.prototype, "dateOfBirth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [base_instructor_dto_1.InstructorCertificateDto] }),
    __metadata("design:type", Array)
], Instructor.prototype, "certificates", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Instructor.prototype, "bio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Instructor.prototype, "idCardPhoto", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Instructor.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: constant_1.InstructorStatus,
        default: constant_1.InstructorStatus.ACTIVE
    }),
    __metadata("design:type", String)
], Instructor.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Instructor.prototype, "balance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: base_instructor_dto_1.PaymentInfoDto }),
    __metadata("design:type", base_instructor_dto_1.PaymentInfoDto)
], Instructor.prototype, "paymentInfo", void 0);
exports.Instructor = Instructor = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'instructors',
        timestamps: {
            createdAt: true,
            updatedAt: true
        },
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            }
        }
    }),
    __metadata("design:paramtypes", [String])
], Instructor);
exports.InstructorSchema = mongoose_1.SchemaFactory.createForClass(Instructor);
exports.InstructorSchema.plugin(paginate);
exports.InstructorSchema.index({ email: 1 });
exports.InstructorSchema.index({ name: 'text', email: 'text' });
//# sourceMappingURL=instructor.schema.js.map