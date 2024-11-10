"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PastYear = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
let PastYearValidator = class PastYearValidator {
    validate(value, validationArguments) {
        const now = new Date();
        const yearsAgo = validationArguments.constraints[0] || 10;
        return now.getFullYear() - new Date(value).getFullYear() >= yearsAgo;
    }
    defaultMessage(args) {
        const yearsAgo = args.constraints[0] || 10;
        return `Date must be older than ${yearsAgo} years from now`;
    }
};
PastYearValidator = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'pastYear' })
], PastYearValidator);
function PastYear(yearsAgo = 10) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsDateString)({ strict: true }), (0, class_validator_1.Validate)(PastYearValidator, [yearsAgo]));
}
exports.PastYear = PastYear;
//# sourceMappingURL=past-year.validator.js.map