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
exports.AssignmentSubmissionSchema = exports.AssignmentSubmission = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const class_transformer_1 = require("class-transformer");
const base_media_dto_1 = require("../../media/dto/base-media.dto");
const assignment_schema_1 = require("./assignment.schema");
const learner_schema_1 = require("../../learner/schemas/learner.schema");
const constant_1 = require("../../common/contracts/constant");
const class_schema_1 = require("./class.schema");
let AssignmentSubmission = class AssignmentSubmission {
    constructor(id) {
        this._id = id;
    }
};
exports.AssignmentSubmission = AssignmentSubmission;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], AssignmentSubmission.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [base_media_dto_1.BaseMediaDto], required: true }),
    __metadata("design:type", Array)
], AssignmentSubmission.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], AssignmentSubmission.prototype, "point", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], AssignmentSubmission.prototype, "feedback", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: constant_1.SubmissionStatus, default: constant_1.SubmissionStatus.SUBMITTED }),
    __metadata("design:type", String)
], AssignmentSubmission.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: assignment_schema_1.Assignment.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AssignmentSubmission.prototype, "assignmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: class_schema_1.Class.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AssignmentSubmission.prototype, "classId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: learner_schema_1.Learner.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AssignmentSubmission.prototype, "learnerId", void 0);
exports.AssignmentSubmission = AssignmentSubmission = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'assignment-submissions',
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
], AssignmentSubmission);
exports.AssignmentSubmissionSchema = mongoose_1.SchemaFactory.createForClass(AssignmentSubmission);
exports.AssignmentSubmissionSchema.index({ assignmentId: 1, learnerId: 1 });
exports.AssignmentSubmissionSchema.virtual('learner', {
    ref: 'Learner',
    localField: 'learnerId',
    foreignField: '_id',
    justOne: true
});
//# sourceMappingURL=assignment-submission.schema.js.map