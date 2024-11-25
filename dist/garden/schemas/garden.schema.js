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
exports.GardenSchema = exports.Garden = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
const garden_manager_schema_1 = require("../../garden-manager/schemas/garden-manager.schema");
let Garden = class Garden {
    constructor(id) {
        this._id = id;
    }
};
exports.Garden = Garden;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], Garden.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Garden.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Garden.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Garden.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Garden.prototype, "addressLink", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Array], required: true }),
    __metadata("design:type", Array)
], Garden.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: constant_1.GardenStatus,
        default: constant_1.GardenStatus.ACTIVE
    }),
    __metadata("design:type", String)
], Garden.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], Garden.prototype, "maxClass", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: garden_manager_schema_1.GardenManager.name, required: true }),
    __metadata("design:type", Object)
], Garden.prototype, "gardenManagerId", void 0);
exports.Garden = Garden = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'gardens',
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
], Garden);
exports.GardenSchema = mongoose_1.SchemaFactory.createForClass(Garden);
exports.GardenSchema.plugin(paginate);
exports.GardenSchema.index({ gardenManagerId: 1 });
exports.GardenSchema.index({ name: 1 }, { unique: true });
exports.GardenSchema.index({ name: 'text', address: 'text' });
exports.GardenSchema.virtual('gardenManager', {
    ref: 'GardenManager',
    localField: 'gardenManagerId',
    foreignField: '_id'
});
//# sourceMappingURL=garden.schema.js.map