"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrimRequestBodyPipe = void 0;
const error_1 = require("../contracts/error");
const app_exception_1 = require("../exceptions/app.exception");
const common_1 = require("@nestjs/common");
let TrimRequestBodyPipe = class TrimRequestBodyPipe {
    isObj(obj) {
        return typeof obj === 'object' && obj !== null;
    }
    trim(values) {
        Object.keys(values).forEach((key) => {
            if (this.isObj(values[key])) {
                values[key] = this.trim(values[key]);
            }
            else {
                if (typeof values[key] === 'string') {
                    values[key] = values[key].trim();
                }
            }
        });
        return values;
    }
    transform(values, metadata) {
        const { type } = metadata;
        if (type === 'body') {
            if (this.isObj(values)) {
                return this.trim(values);
            }
            throw new app_exception_1.AppException(error_1.Errors.VALIDATION_FAILED);
        }
        return values;
    }
};
exports.TrimRequestBodyPipe = TrimRequestBodyPipe;
exports.TrimRequestBodyPipe = TrimRequestBodyPipe = __decorate([
    (0, common_1.Injectable)()
], TrimRequestBodyPipe);
//# sourceMappingURL=trim-req-body.pipe.js.map