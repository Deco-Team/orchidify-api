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
exports.AssignmentSchema = exports.Assignment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_transformer_1 = require("class-transformer");
const base_media_dto_1 = require("../../media/dto/base-media.dto");
let Assignment = class Assignment {
    constructor(id) {
        this._id = id;
    }
};
exports.Assignment = Assignment;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], Assignment.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Assignment.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Assignment.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [base_media_dto_1.BaseMediaDto], required: true }),
    __metadata("design:type", Array)
], Assignment.prototype, "attachments", void 0);
exports.Assignment = Assignment = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: false,
    }),
    __metadata("design:paramtypes", [String])
], Assignment);
exports.AssignmentSchema = mongoose_1.SchemaFactory.createForClass(Assignment);
//# sourceMappingURL=assignment.schema.js.map