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
exports.CourseSchema = exports.Course = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
const instructor_schema_1 = require("../../instructor/schemas/instructor.schema");
const base_media_dto_1 = require("../../media/dto/base-media.dto");
const session_schema_1 = require("../../class/schemas/session.schema");
const constant_2 = require("../../common/contracts/constant");
const rating_summary_dto_1 = require("../../class/dto/rating-summary.dto");
let Course = class Course {
    constructor(id) {
        this._id = id;
    }
};
exports.Course = Course;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], Course.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Course.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Course.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Course.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: constant_2.CourseLevel }),
    __metadata("design:type", String)
], Course.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Course.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Course.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Course.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [base_media_dto_1.BaseMediaDto] }),
    __metadata("design:type", Array)
], Course.prototype, "media", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: constant_1.CourseStatus,
        default: constant_1.CourseStatus.DRAFT
    }),
    __metadata("design:type", String)
], Course.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [session_schema_1.SessionSchema], select: false }),
    __metadata("design:type", Array)
], Course.prototype, "sessions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: Course.name }] }),
    __metadata("design:type", Array)
], Course.prototype, "childCourseIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Course.prototype, "learnerLimit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Course.prototype, "rate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Course.prototype, "discount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Course.prototype, "gardenRequiredToolkits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: instructor_schema_1.Instructor.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Course.prototype, "instructorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Course.prototype, "isRequesting", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: rating_summary_dto_1.BaseRatingSummaryDto }),
    __metadata("design:type", rating_summary_dto_1.BaseRatingSummaryDto)
], Course.prototype, "ratingSummary", void 0);
exports.Course = Course = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'courses',
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
], Course);
exports.CourseSchema = mongoose_1.SchemaFactory.createForClass(Course);
exports.CourseSchema.plugin(paginate);
exports.CourseSchema.index({ title: 'text' });
exports.CourseSchema.virtual('classes', {
    ref: 'Class',
    localField: '_id',
    foreignField: 'courseId'
});
exports.CourseSchema.virtual('instructor', {
    ref: 'Instructor',
    localField: 'instructorId',
    foreignField: '_id',
    justOne: true
});
exports.CourseSchema.virtual('childCourses', {
    ref: 'Course',
    localField: 'childCourseIds',
    foreignField: '_id'
});
exports.CourseSchema.virtual('combos', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'childCourseIds'
});
//# sourceMappingURL=course.schema.js.map