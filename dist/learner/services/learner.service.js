"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearnerService = exports.ILearnerService = void 0;
const constant_1 = require("../../common/contracts/constant");
const constant_2 = require("../contracts/constant");
const common_1 = require("@nestjs/common");
const learner_repository_1 = require("../repositories/learner.repository");
exports.ILearnerService = Symbol('ILearnerService');
let LearnerService = class LearnerService {
    constructor(learnerRepository) {
        this.learnerRepository = learnerRepository;
    }
    create(learner, options) {
        return this.learnerRepository.create(learner, options);
    }
    async findById(learnerId, projection) {
        const learner = await this.learnerRepository.findOne({
            conditions: {
                _id: learnerId
            },
            projection
        });
        return learner;
    }
    async findByEmail(email, projection) {
        const learner = await this.learnerRepository.findOne({
            conditions: {
                email
            },
            projection
        });
        return learner;
    }
    update(conditions, payload, options) {
        return this.learnerRepository.findOneAndUpdate(conditions, payload, options);
    }
    async list(pagination, queryLearnerDto, projection = constant_2.LEARNER_LIST_PROJECTION) {
        const { name, email, status } = queryLearnerDto;
        const filter = {
            status: {
                $ne: constant_1.LearnerStatus.UNVERIFIED
            }
        };
        const validStatus = status?.filter((status) => [constant_1.LearnerStatus.ACTIVE, constant_1.LearnerStatus.INACTIVE].includes(status));
        if (validStatus?.length > 0) {
            filter['status'] = {
                $in: validStatus
            };
        }
        let textSearch = '';
        if (name)
            textSearch += name.trim();
        if (email)
            textSearch += ' ' + email.trim();
        if (textSearch) {
            filter['$text'] = {
                $search: textSearch.trim()
            };
        }
        return this.learnerRepository.model.paginate(filter, {
            ...pagination,
            projection
        });
    }
    async findMany(conditions, projection, populates) {
        const learners = await this.learnerRepository.findMany({
            conditions,
            projection,
            populates
        });
        return learners;
    }
};
exports.LearnerService = LearnerService;
exports.LearnerService = LearnerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(learner_repository_1.ILearnerRepository)),
    __metadata("design:paramtypes", [Object])
], LearnerService);
//# sourceMappingURL=learner.service.js.map