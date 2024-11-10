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
exports.GardenManagerSchema = exports.GardenManager = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
let GardenManager = class GardenManager {
    constructor(id) {
        this._id = id;
    }
};
exports.GardenManager = GardenManager;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], GardenManager.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], GardenManager.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], GardenManager.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, select: false }),
    __metadata("design:type", String)
], GardenManager.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], GardenManager.prototype, "idCardPhoto", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: constant_1.GardenManagerStatus,
        default: constant_1.GardenManagerStatus.ACTIVE
    }),
    __metadata("design:type", String)
], GardenManager.prototype, "status", void 0);
exports.GardenManager = GardenManager = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'garden-managers',
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
], GardenManager);
exports.GardenManagerSchema = mongoose_1.SchemaFactory.createForClass(GardenManager);
exports.GardenManagerSchema.plugin(paginate);
exports.GardenManagerSchema.index({ email: 1 });
exports.GardenManagerSchema.index({ name: 'text', email: 'text' });
exports.GardenManagerSchema.virtual('gardens', {
    ref: 'Garden',
    localField: '_id',
    foreignField: 'gardenManagerId'
});
//# sourceMappingURL=garden-manager.schema.js.map