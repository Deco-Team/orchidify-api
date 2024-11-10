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
exports.StaffSchema = exports.Staff = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
let Staff = class Staff {
    constructor(id) {
        this._id = id;
    }
};
exports.Staff = Staff;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], Staff.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Staff.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Staff.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Staff.prototype, "staffCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, select: false }),
    __metadata("design:type", String)
], Staff.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: constant_1.StaffStatus,
        default: constant_1.StaffStatus.ACTIVE
    }),
    __metadata("design:type", String)
], Staff.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Staff.prototype, "idCardPhoto", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: [constant_1.UserRole.ADMIN, constant_1.UserRole.STAFF],
        default: constant_1.UserRole.STAFF
    }),
    __metadata("design:type", String)
], Staff.prototype, "role", void 0);
exports.Staff = Staff = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'staffs',
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
], Staff);
exports.StaffSchema = mongoose_1.SchemaFactory.createForClass(Staff);
exports.StaffSchema.plugin(paginate);
exports.StaffSchema.index({ email: 1 });
exports.StaffSchema.index({ name: 'text', email: 'text' });
//# sourceMappingURL=staff.schema.js.map