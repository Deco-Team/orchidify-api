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
exports.RecruitmentSchema = exports.Recruitment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
const staff_schema_1 = require("../../staff/schemas/staff.schema");
class ApplicationInfo {
}
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ApplicationInfo.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ApplicationInfo.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ApplicationInfo.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ApplicationInfo.prototype, "cv", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ApplicationInfo.prototype, "note", void 0);
class RecruitmentStatusHistory {
}
__decorate([
    (0, mongoose_1.Prop)({ enum: constant_1.RecruitmentStatus, required: true }),
    __metadata("design:type", String)
], RecruitmentStatusHistory.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], RecruitmentStatusHistory.prototype, "timestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], RecruitmentStatusHistory.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: constant_1.UserRole }),
    __metadata("design:type", String)
], RecruitmentStatusHistory.prototype, "userRole", void 0);
let Recruitment = class Recruitment {
    constructor(id) {
        this._id = id;
    }
};
exports.Recruitment = Recruitment;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], Recruitment.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ApplicationInfo, required: true }),
    __metadata("design:type", ApplicationInfo)
], Recruitment.prototype, "applicationInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Recruitment.prototype, "meetingUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Recruitment.prototype, "meetingDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: constant_1.RecruitmentStatus,
        default: constant_1.RecruitmentStatus.PENDING
    }),
    __metadata("design:type", String)
], Recruitment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [RecruitmentStatusHistory] }),
    __metadata("design:type", Array)
], Recruitment.prototype, "histories", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Recruitment.prototype, "rejectReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean }),
    __metadata("design:type", Boolean)
], Recruitment.prototype, "isInstructorAdded", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: staff_schema_1.Staff.name }),
    __metadata("design:type", Object)
], Recruitment.prototype, "handledBy", void 0);
exports.Recruitment = Recruitment = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'recruitments',
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
], Recruitment);
exports.RecruitmentSchema = mongoose_1.SchemaFactory.createForClass(Recruitment);
exports.RecruitmentSchema.plugin(paginate);
exports.RecruitmentSchema.index({ 'applicationInfo.name': 'text', 'applicationInfo.email': 'text' });
//# sourceMappingURL=recruitment.schema.js.map