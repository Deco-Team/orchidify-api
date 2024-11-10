"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppException = void 0;
const common_1 = require("@nestjs/common");
const ErrorResponseDefaultValues = {
    error: 'INTERNAL_SERVER_ERROR',
    httpStatus: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
    data: {}
};
class AppException extends Error {
    constructor(params) {
        const initData = Object.assign(Object.assign({}, ErrorResponseDefaultValues), params);
        super(initData.message);
        this.error = initData.error;
        this.httpStatus = initData.httpStatus;
        this.data = initData.data;
    }
}
exports.AppException = AppException;
//# sourceMappingURL=app.exception.js.map