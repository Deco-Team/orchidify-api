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
exports.GardenTimesheetSchema = exports.GardenTimesheet = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
const garden_schema_1 = require("../../garden/schemas/garden.schema");
const slot_schema_1 = require("./slot.schema");
let GardenTimesheet = class GardenTimesheet {
    constructor(id) {
        this._id = id;
    }
};
exports.GardenTimesheet = GardenTimesheet;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], GardenTimesheet.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: constant_1.GardenTimesheetStatus,
        default: constant_1.GardenTimesheetStatus.ACTIVE
    }),
    __metadata("design:type", String)
], GardenTimesheet.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], GardenTimesheet.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: garden_schema_1.Garden.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], GardenTimesheet.prototype, "gardenId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [slot_schema_1.SlotSchema] }),
    __metadata("design:type", Array)
], GardenTimesheet.prototype, "slots", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], GardenTimesheet.prototype, "gardenMaxClass", void 0);
exports.GardenTimesheet = GardenTimesheet = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'garden-timesheets',
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
], GardenTimesheet);
exports.GardenTimesheetSchema = mongoose_1.SchemaFactory.createForClass(GardenTimesheet);
exports.GardenTimesheetSchema.plugin(paginate);
exports.GardenTimesheetSchema.index({ date: 1, status: 1, gardenId: 1 }, { unique: true });
exports.GardenTimesheetSchema.index({ 'slots._id': 1, 'slots.instructorId': 1, date: 1 });
//# sourceMappingURL=garden-timesheet.schema.js.map