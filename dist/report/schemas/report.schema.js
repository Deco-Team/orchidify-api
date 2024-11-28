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
exports.ReportSchema = exports.Report = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../contracts/constant");
let Report = class Report {
    constructor(id) {
        this._id = id;
    }
};
exports.Report = Report;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], Report.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: constant_1.ReportType, required: true }),
    __metadata("design:type", String)
], Report.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: constant_1.ReportTag, required: true }),
    __metadata("design:type", String)
], Report.prototype, "tag", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Report.prototype, "ownerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.Map, required: true }),
    __metadata("design:type", Object)
], Report.prototype, "data", void 0);
exports.Report = Report = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'reports',
        timestamps: {
            createdAt: true,
            updatedAt: true
        },
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            }
        }
    }),
    __metadata("design:paramtypes", [String])
], Report);
exports.ReportSchema = mongoose_1.SchemaFactory.createForClass(Report);
exports.ReportSchema.plugin(paginate);
exports.ReportSchema.index({ type: 1, tag: 1 });
//# sourceMappingURL=report.schema.js.map