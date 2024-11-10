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
exports.FeedbackSchema = exports.Feedback = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const learner_schema_1 = require("../../learner/schemas/learner.schema");
const class_schema_1 = require("../../class/schemas/class.schema");
const course_schema_1 = require("../../course/schemas/course.schema");
let Feedback = class Feedback {
    constructor(id) {
        this._id = id;
    }
};
exports.Feedback = Feedback;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], Feedback.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Feedback.prototype, "rate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Feedback.prototype, "comment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: learner_schema_1.Learner.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Feedback.prototype, "learnerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: class_schema_1.Class.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Feedback.prototype, "classId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: course_schema_1.Course.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Feedback.prototype, "courseId", void 0);
exports.Feedback = Feedback = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'feedbacks',
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
], Feedback);
exports.FeedbackSchema = mongoose_1.SchemaFactory.createForClass(Feedback);
exports.FeedbackSchema.plugin(paginate);
exports.FeedbackSchema.index({ learnerId: 1, classId: 1, courseId: 1 });
exports.FeedbackSchema.virtual('learner', {
    ref: 'Learner',
    localField: 'learnerId',
    foreignField: '_id',
    justOne: true
});
//# sourceMappingURL=feedback.schema.js.map