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
exports.ClassSchema = exports.Class = exports.Progress = exports.ClassStatusHistory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
const instructor_schema_1 = require("../../instructor/schemas/instructor.schema");
const garden_schema_1 = require("../../garden/schemas/garden.schema");
const base_media_dto_1 = require("../../media/dto/base-media.dto");
const session_schema_1 = require("./session.schema");
const constant_2 = require("../../common/contracts/constant");
const course_schema_1 = require("../../course/schemas/course.schema");
const rating_summary_dto_1 = require("../dto/rating-summary.dto");
class ClassStatusHistory {
}
exports.ClassStatusHistory = ClassStatusHistory;
__decorate([
    (0, mongoose_1.Prop)({ enum: constant_1.ClassStatus, required: true }),
    __metadata("design:type", String)
], ClassStatusHistory.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], ClassStatusHistory.prototype, "timestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ClassStatusHistory.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: constant_1.UserRole }),
    __metadata("design:type", String)
], ClassStatusHistory.prototype, "userRole", void 0);
class Progress {
}
exports.Progress = Progress;
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Progress.prototype, "total", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], Progress.prototype, "completed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, default: 0 }),
    __metadata("design:type", Number)
], Progress.prototype, "percentage", void 0);
let Class = class Class {
    constructor(id) {
        this._id = id;
    }
};
exports.Class = Class;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], Class.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Class.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Class.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Class.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Class.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Class.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: constant_2.CourseLevel, required: true }),
    __metadata("design:type", String)
], Class.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Class.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Class.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Class.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [base_media_dto_1.BaseMediaDto], required: true }),
    __metadata("design:type", Array)
], Class.prototype, "media", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [session_schema_1.SessionSchema], select: false }),
    __metadata("design:type", Array)
], Class.prototype, "sessions", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: constant_1.ClassStatus,
        default: constant_1.ClassStatus.PUBLISHED
    }),
    __metadata("design:type", String)
], Class.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [ClassStatusHistory]
    }),
    __metadata("design:type", Array)
], Class.prototype, "histories", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Class.prototype, "learnerLimit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Class.prototype, "learnerQuantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], enum: constant_1.Weekday }),
    __metadata("design:type", Array)
], Class.prototype, "weekdays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number], enum: constant_1.SlotNumber }),
    __metadata("design:type", Array)
], Class.prototype, "slotNumbers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Class.prototype, "rate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Class.prototype, "cancelReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Class.prototype, "gardenRequiredToolkits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: instructor_schema_1.Instructor.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Class.prototype, "instructorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: garden_schema_1.Garden.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Class.prototype, "gardenId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: course_schema_1.Course.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Class.prototype, "courseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Progress, required: true }),
    __metadata("design:type", Progress)
], Class.prototype, "progress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: rating_summary_dto_1.BaseRatingSummaryDto }),
    __metadata("design:type", rating_summary_dto_1.BaseRatingSummaryDto)
], Class.prototype, "ratingSummary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean }),
    __metadata("design:type", Boolean)
], Class.prototype, "hasSentCertificate", void 0);
exports.Class = Class = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'classes',
        timestamps: {
            createdAt: true,
            updatedAt: true
        },
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            },
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }),
    __metadata("design:paramtypes", [String])
], Class);
exports.ClassSchema = mongoose_1.SchemaFactory.createForClass(Class);
exports.ClassSchema.plugin(paginate);
exports.ClassSchema.index({ title: 'text' });
exports.ClassSchema.virtual('garden', {
    ref: 'Garden',
    localField: 'gardenId',
    foreignField: '_id',
    justOne: true
});
exports.ClassSchema.virtual('instructor', {
    ref: 'Instructor',
    localField: 'instructorId',
    foreignField: '_id',
    justOne: true
});
exports.ClassSchema.virtual('learnerClass', {
    ref: 'LearnerClass',
    localField: '_id',
    foreignField: 'classId',
    justOne: true
});
exports.ClassSchema.virtual('course', {
    ref: 'Course',
    localField: 'courseId',
    foreignField: '_id',
    justOne: true
});
//# sourceMappingURL=class.schema.js.map