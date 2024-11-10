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
exports.SlotSchema = exports.Slot = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
const class_schema_1 = require("../../class/schemas/class.schema");
const instructor_schema_1 = require("../../instructor/schemas/instructor.schema");
const session_schema_1 = require("../../class/schemas/session.schema");
let Slot = class Slot {
    constructor(id) {
        this._id = id;
    }
};
exports.Slot = Slot;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], Slot.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, enum: constant_1.SlotNumber }),
    __metadata("design:type", Number)
], Slot.prototype, "slotNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Slot.prototype, "start", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Slot.prototype, "end", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: constant_1.SlotStatus,
        default: constant_1.SlotStatus.AVAILABLE
    }),
    __metadata("design:type", String)
], Slot.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: instructor_schema_1.Instructor.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Slot.prototype, "instructorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: session_schema_1.Session.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Slot.prototype, "sessionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: class_schema_1.Class.name }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Slot.prototype, "classId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.Map }),
    __metadata("design:type", Object)
], Slot.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Slot.prototype, "hasTakenAttendance", void 0);
exports.Slot = Slot = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: {
            createdAt: true,
            updatedAt: true
        },
    }),
    __metadata("design:paramtypes", [String])
], Slot);
exports.SlotSchema = mongoose_1.SchemaFactory.createForClass(Slot);
//# sourceMappingURL=slot.schema.js.map