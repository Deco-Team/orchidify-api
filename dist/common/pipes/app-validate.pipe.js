"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const app_exception_1 = require("../exceptions/app.exception");
const _ = require("lodash");
class AppValidationPipe extends common_1.ValidationPipe {
    constructor(options) {
        super({
            ...options,
            whitelist: true,
            exceptionFactory: (validationErrors = []) => {
                throw new app_exception_1.AppException({
                    error: 'INVALID_PARAMS',
                    message: AppValidationPipe.getFirstMessage(validationErrors),
                    httpStatus: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    data: validationErrors
                });
            }
        });
    }
    static getFirstMessage(validationErrors) {
        let message = 'Params are invalid';
        if (validationErrors.length) {
            const firstError = validationErrors[0];
            if (firstError.constraints) {
                console.log(Object.values(firstError.constraints));
                message = _.get(Object.values(firstError.constraints), '[0]', message);
            }
            else {
                message = AppValidationPipe.getFirstMessage(firstError.children);
            }
        }
        return message;
    }
}
exports.AppValidationPipe = AppValidationPipe;
//# sourceMappingURL=app-validate.pipe.js.map