"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
const app_exception_1 = require("../exceptions/app.exception");
const error_1 = require("../contracts/error");
class AbstractRepository {
    constructor(model) {
        this.model = model;
    }
    findOne({ conditions, projection, populates, options }) {
        const query = this.model.findOne(conditions, projection, options);
        query.populate(populates);
        return query.exec();
    }
    async firstOrFail({ conditions, projection, options, populates, error }) {
        const entity = await this.findOne({
            conditions,
            projection,
            populates,
            options
        });
        if (entity) {
            return entity;
        }
        if (!error) {
            error = error_1.Errors.OBJECT_NOT_FOUND;
        }
        throw new app_exception_1.AppException(error);
    }
    findMany({ conditions, projection, populates, sort, options }) {
        const query = this.model.find(conditions, projection, options);
        query.populate(populates);
        if (sort) {
            query.sort(sort);
        }
        return query.exec();
    }
    paginate(conditions, options) {
        return this.model.paginate(conditions, options);
    }
    async create(payload, options) {
        const entity = new this.model(payload);
        await entity.save(options);
        return entity;
    }
    async updateOneOrFail(conditions, payload, options) {
        const data = await this.firstOrFail({ conditions });
        data.set(payload);
        return data.save(options);
    }
    findOneAndUpdate(conditions, payload, options) {
        return this.model.findOneAndUpdate(conditions, payload, options).exec();
    }
    updateMany(conditions, payload, options) {
        return this.model.updateMany(conditions, payload, options).exec();
    }
    findOneAndDelete(conditions, options) {
        return this.model.findOneAndDelete(conditions, options).exec();
    }
    deleteMany(conditions, options) {
        return this.model.deleteMany(conditions, options).exec();
    }
}
exports.AbstractRepository = AbstractRepository;
//# sourceMappingURL=index.js.map