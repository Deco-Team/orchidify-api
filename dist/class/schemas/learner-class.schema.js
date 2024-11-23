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
exports.LearnerClassSchema = exports.LearnerClass = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const transaction_schema_1 = require("../../transaction/schemas/transaction.schema");
const learner_schema_1 = require("../../learner/schemas/learner.schema");
const class_schema_1 = require("./class.schema");
const course_schema_1 = require("../../course/schemas/course.schema");
let LearnerClass = class LearnerClass {
    constructor(id) {
        this._id = id;
    }
};
exports.LearnerClass = LearnerClass;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], LearnerClass.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], LearnerClass.prototype, "enrollDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], LearnerClass.prototype, "finishDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: transaction_schema_1.Transaction.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LearnerClass.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: learner_schema_1.Learner.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LearnerClass.prototype, "learnerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: class_schema_1.Class.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LearnerClass.prototype, "classId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: course_schema_1.Course.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LearnerClass.prototype, "courseId", void 0);
exports.LearnerClass = LearnerClass = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'learner-classes',
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
], LearnerClass);
exports.LearnerClassSchema = mongoose_1.SchemaFactory.createForClass(LearnerClass);
exports.LearnerClassSchema.plugin(paginate);
exports.LearnerClassSchema.index({ learnerId: 1, classId: 1 });
exports.LearnerClassSchema.virtual('learner', {
    ref: 'Learner',
    localField: 'learnerId',
    foreignField: '_id',
    justOne: true
});
exports.LearnerClassSchema.virtual('class', {
    ref: 'Class',
    localField: 'classId',
    foreignField: '_id',
    justOne: true
});
exports.LearnerClassSchema.virtual('submission', {
    ref: 'AssignmentSubmission',
    localField: 'classId',
    foreignField: 'classId',
    justOne: true
});
exports.LearnerClassSchema.virtual('transaction', {
    ref: 'Transaction',
    localField: 'transactionId',
    foreignField: '_id',
    justOne: true
});
//# sourceMappingURL=learner-class.schema.js.map