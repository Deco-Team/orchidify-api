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
exports.SessionSchema = exports.Session = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_transformer_1 = require("class-transformer");
const assignment_schema_1 = require("./assignment.schema");
const session_dto_1 = require("../dto/session.dto");
let Session = class Session {
    constructor(id) {
        this._id = id;
    }
};
exports.Session = Session;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], Session.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Session.prototype, "sessionNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Session.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Session.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [session_dto_1.SessionMediaDto], required: true }),
    __metadata("design:type", Array)
], Session.prototype, "media", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [assignment_schema_1.AssignmentSchema] }),
    __metadata("design:type", Array)
], Session.prototype, "assignments", void 0);
exports.Session = Session = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: false,
    }),
    __metadata("design:paramtypes", [String])
], Session);
exports.SessionSchema = mongoose_1.SchemaFactory.createForClass(Session);
//# sourceMappingURL=session.schema.js.map