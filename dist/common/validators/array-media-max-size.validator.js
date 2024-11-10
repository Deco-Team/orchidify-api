"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayMediaMaxSize = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
let ArrayMediaMaxSizeValidator = class ArrayMediaMaxSizeValidator {
    validate(value, validationArguments) {
        const { max, resource_type } = validationArguments.constraints[0];
        const valueByType = value?.filter((item) => item.resource_type === resource_type) || [];
        return valueByType.length <= max;
    }
    defaultMessage(args) {
        const { max, resource_type } = args.constraints[0];
        return `Number of ${resource_type} must be not bigger than ${max}.`;
    }
};
ArrayMediaMaxSizeValidator = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'arrayMediaMaxSize' })
], ArrayMediaMaxSizeValidator);
function ArrayMediaMaxSize(max, resource_type) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsArray)(), (0, class_validator_1.Validate)(ArrayMediaMaxSizeValidator, [{ max, resource_type }]));
}
exports.ArrayMediaMaxSize = ArrayMediaMaxSize;
//# sourceMappingURL=array-media-max-size.validator.js.map