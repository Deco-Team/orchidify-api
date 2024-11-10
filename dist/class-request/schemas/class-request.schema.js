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
exports.ClassRequestSchema = exports.ClassRequest = exports.ClassRequestStatusHistory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
const instructor_schema_1 = require("../../instructor/schemas/instructor.schema");
const class_schema_1 = require("../../class/schemas/class.schema");
const course_schema_1 = require("../../course/schemas/course.schema");
class ClassRequestStatusHistory {
}
exports.ClassRequestStatusHistory = ClassRequestStatusHistory;
__decorate([
    (0, mongoose_1.Prop)({ enum: constant_1.ClassRequestStatus, required: true }),
    __metadata("design:type", String)
], ClassRequestStatusHistory.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], ClassRequestStatusHistory.prototype, "timestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ClassRequestStatusHistory.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: constant_1.UserRole }),
    __metadata("design:type", String)
], ClassRequestStatusHistory.prototype, "userRole", void 0);
let ClassRequest = class ClassRequest {
    constructor(id) {
        this._id = id;
    }
};
exports.ClassRequest = ClassRequest;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], ClassRequest.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, enum: constant_1.ClassRequestType }),
    __metadata("design:type", String)
], ClassRequest.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: constant_1.ClassRequestStatus,
        default: constant_1.ClassRequestStatus.PENDING
    }),
    __metadata("design:type", String)
], ClassRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ClassRequest.prototype, "rejectReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [ClassRequestStatusHistory]
    }),
    __metadata("design:type", Array)
], ClassRequest.prototype, "histories", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ClassRequest.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.Map }),
    __metadata("design:type", Object)
], ClassRequest.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: instructor_schema_1.Instructor.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ClassRequest.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: course_schema_1.Course.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ClassRequest.prototype, "courseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: class_schema_1.Class.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ClassRequest.prototype, "classId", void 0);
exports.ClassRequest = ClassRequest = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'class-requests',
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
], ClassRequest);
exports.ClassRequestSchema = mongoose_1.SchemaFactory.createForClass(ClassRequest);
exports.ClassRequestSchema.plugin(paginate);
//# sourceMappingURL=class-request.schema.js.map