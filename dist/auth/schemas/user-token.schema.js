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
exports.UserTokenSchema = exports.UserToken = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("../../common/contracts/constant");
let UserToken = class UserToken {
    constructor(id) {
        this._id = id;
    }
};
exports.UserToken = UserToken;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], UserToken.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], UserToken.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: constant_1.UserRole, required: true }),
    __metadata("design:type", String)
], UserToken.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], UserToken.prototype, "refreshToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], UserToken.prototype, "enabled", void 0);
exports.UserToken = UserToken = __decorate([
    (0, mongoose_1.Schema)({
        collection: 'user-tokens',
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
], UserToken);
exports.UserTokenSchema = mongoose_1.SchemaFactory.createForClass(UserToken);
exports.UserTokenSchema.plugin(paginate);
//# sourceMappingURL=user-token.schema.js.map