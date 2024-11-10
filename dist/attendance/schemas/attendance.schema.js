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
exports.AttendanceSchema = exports.Attendance = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
const learner_schema_1 = require("../../learner/schemas/learner.schema");
const slot_schema_1 = require("../../garden-timesheet/schemas/slot.schema");
let Attendance = class Attendance {
    constructor(id) {
        this._id = id;
    }
};
exports.Attendance = Attendance;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], Attendance.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: constant_1.AttendanceStatus,
        default: constant_1.AttendanceStatus.NOT_YET
    }),
    __metadata("design:type", String)
], Attendance.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Attendance.prototype, "note", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: learner_schema_1.Learner.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Attendance.prototype, "learnerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: slot_schema_1.Slot.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Attendance.prototype, "slotId", void 0);
exports.Attendance = Attendance = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'attendances',
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
], Attendance);
exports.AttendanceSchema = mongoose_1.SchemaFactory.createForClass(Attendance);
exports.AttendanceSchema.plugin(paginate);
exports.AttendanceSchema.index({ slotId: 1, learnerId: 1 });
exports.AttendanceSchema.virtual('learner', {
    ref: 'Learner',
    localField: 'learnerId',
    foreignField: '_id',
    justOne: true
});
//# sourceMappingURL=attendance.schema.js.map