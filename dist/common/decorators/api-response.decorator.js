"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiErrorResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lodash_1 = require("lodash");
function ApiErrorResponse(errorResponses) {
    const decorators = [];
    const errorsMap = new Map();
    errorResponses?.forEach((errorResponse) => {
        const errors = errorsMap.get(errorResponse.httpStatus);
        if (!errors) {
            errorsMap.set(errorResponse.httpStatus, [errorResponse]);
        }
        else
            errors.push(errorResponse);
    });
    errorsMap.forEach((value, key) => {
        decorators.push((0, swagger_1.ApiResponse)({
            status: key,
            description: key.toString(),
            content: {
                'application/json': {
                    examples: value.reduce((list, schema) => {
                        list[schema.error] = { value: schema };
                        list[schema.error] = { value: (0, lodash_1.omit)(schema, 'httpStatus') };
                        return list;
                    }, {})
                }
            }
        }));
    });
    return (0, common_1.applyDecorators)(...decorators);
}
exports.ApiErrorResponse = ApiErrorResponse;
//# sourceMappingURL=api-response.decorator.js.map