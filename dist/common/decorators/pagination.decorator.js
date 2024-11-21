"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = exports.handlePagination = void 0;
const common_1 = require("@nestjs/common");
const _ = require("lodash");
const DEFAULT_LIMIT = 10;
const handlePagination = (request) => {
    const paginationParams = {
        page: request.query.page,
        limit: request.query.limit,
        sort: request.query.sort
    };
    paginationParams.page = Number(paginationParams.page) > 0 ? Number(paginationParams.page) : 1;
    paginationParams.limit =
        Number(paginationParams.limit) >= 1 && Number(paginationParams.limit) <= 100
            ? Number(paginationParams.limit)
            : DEFAULT_LIMIT;
    if (_.isEmpty(paginationParams.sort)) {
        paginationParams.sort = {
            createdAt: -1
        };
    }
    else {
        const result = {};
        const sortFields = paginationParams.sort.split('_');
        sortFields.forEach((item) => {
            if (!item)
                return;
            const sortType = item.indexOf('.asc') !== -1 ? '.asc' : '.desc';
            result[item.replace(sortType, '')] = sortType === '.asc' ? 1 : -1;
        });
        if (_.isEmpty(result)) {
            result['createdAt'] = -1;
        }
        paginationParams.sort = result;
    }
    return paginationParams;
};
exports.handlePagination = handlePagination;
exports.Pagination = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return (0, exports.handlePagination)(request);
});
//# sourceMappingURL=pagination.decorator.js.map