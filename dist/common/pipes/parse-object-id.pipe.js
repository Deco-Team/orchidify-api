"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseObjectIdPipe = void 0;
const error_1 = require("../contracts/error");
const app_exception_1 = require("../exceptions/app.exception");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
let ParseObjectIdPipe = class ParseObjectIdPipe {
    transform(value) {
        const validObjectId = mongoose_1.Types.ObjectId.isValid(value);
        if (!validObjectId)
            throw new app_exception_1.AppException(error_1.Errors.OBJECT_NOT_FOUND);
        return mongoose_1.Types.ObjectId.createFromHexString(value);
    }
};
exports.ParseObjectIdPipe = ParseObjectIdPipe;
exports.ParseObjectIdPipe = ParseObjectIdPipe = __decorate([
    (0, common_1.Injectable)()
], ParseObjectIdPipe);
//# sourceMappingURL=parse-object-id.pipe.js.map