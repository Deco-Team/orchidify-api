"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FutureMaxMonth = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment-timezone");
const class_validator_1 = require("class-validator");
const config_1 = require("../../config");
let FutureMaxMonthValidator = class FutureMaxMonthValidator {
    validate(value, validationArguments) {
        const now = moment().tz(config_1.VN_TIMEZONE);
        const dateMoment = moment(value).tz(config_1.VN_TIMEZONE);
        const month = validationArguments.constraints[0] ?? 1;
        return dateMoment.subtract(month, 'month').isSameOrBefore(now, 'day');
    }
    defaultMessage(args) {
        const month = args.constraints[0] ?? 1;
        return `Date must be before ${month} months from now`;
    }
};
FutureMaxMonthValidator = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'futureMaxMonth' })
], FutureMaxMonthValidator);
function FutureMaxMonth(month = 1) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsDateString)({ strict: true }), (0, class_validator_1.Validate)(FutureMaxMonthValidator, [month]));
}
exports.FutureMaxMonth = FutureMaxMonth;
//# sourceMappingURL=future-max-month.validator.js.map