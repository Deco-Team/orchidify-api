"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayMediaMinSize = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
let ArrayMediaMinSizeValidator = class ArrayMediaMinSizeValidator {
    validate(value, validationArguments) {
        const { min, resource_type } = validationArguments.constraints[0];
        const mediaByType = value?.filter((item) => item.resource_type === resource_type) || [];
        return mediaByType.length >= min;
    }
    defaultMessage(args) {
        const { min, resource_type } = args.constraints[0];
        return `Number of ${resource_type} must be not smaller than ${min}.`;
    }
};
ArrayMediaMinSizeValidator = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'arrayMediaMinSize' })
], ArrayMediaMinSizeValidator);
function ArrayMediaMinSize(min, resource_type) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsArray)(), (0, class_validator_1.Validate)(ArrayMediaMinSizeValidator, [{ min, resource_type }]));
}
exports.ArrayMediaMinSize = ArrayMediaMinSize;
//# sourceMappingURL=array-media-min-size.validator.js.map