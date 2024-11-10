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
exports.LearnerClassService = exports.ILearnerClassService = void 0;
const common_1 = require("@nestjs/common");
const _ = require("lodash");
const learner_class_repository_1 = require("../repositories/learner-class.repository");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const constant_1 = require("../../common/contracts/constant");
const constant_2 = require("../contracts/constant");
const helper_service_1 = require("../../common/services/helper.service");
const class_repository_1 = require("../repositories/class.repository");
exports.ILearnerClassService = Symbol('ILearnerClassService');
let LearnerClassService = class LearnerClassService {
    constructor(learnerClassRepository, classRepository, connection, helperService) {
        this.learnerClassRepository = learnerClassRepository;
        this.classRepository = classRepository;
        this.connection = connection;
        this.helperService = helperService;
    }
    async create(createLearnerClassDto, options) {
        const learnerClass = await this.learnerClassRepository.create(createLearnerClassDto, options);
        return learnerClass;
    }
    async findById(learnerClassId, projection, populates) {
        const learnerClass = await this.learnerClassRepository.findOne({
            conditions: {
                _id: learnerClassId
            },
            projection,
            populates
        });
        return learnerClass;
    }
    async findOneBy(conditions, projection, populates) {
        const learnerClass = await this.learnerClassRepository.findOne({
            conditions,
            projection,
            populates
        });
        return learnerClass;
    }
    async findMany(conditions, projection, populates) {
        const learnerClasses = await this.learnerClassRepository.findMany({
            conditions,
            projection,
            populates
        });
        return learnerClasses;
    }
    update(conditions, payload, options) {
        return this.learnerClassRepository.findOneAndUpdate(conditions, payload, options);
    }
    async listMyClassesByLearner(learnerId, pagination, queryClassDto, projection = constant_2.LEARNER_VIEW_MY_CLASS_LIST_PROJECTION) {
        const { title, type, level, status, fromPrice, toPrice } = queryClassDto;
        const { sort, limit, page } = pagination;
        const learnerClassFilter = {
            learnerId: new mongoose_1.Types.ObjectId(learnerId)
        };
        const classFilter = {};
        if (title) {
            classFilter['$text'] = {
                $search: title
            };
        }
        if (type) {
            classFilter['type'] = type;
        }
        const validLevel = level?.filter((level) => [constant_1.CourseLevel.BASIC, constant_1.CourseLevel.INTERMEDIATE, constant_1.CourseLevel.ADVANCED].includes(level));
        if (validLevel?.length > 0) {
            classFilter['level'] = {
                $in: validLevel
            };
        }
        const validStatus = status?.filter((status) => [constant_1.ClassStatus.PUBLISHED, constant_1.ClassStatus.IN_PROGRESS, constant_1.ClassStatus.COMPLETED, constant_1.ClassStatus.CANCELED].includes(status));
        if (validStatus?.length > 0) {
            classFilter['status'] = {
                $in: validStatus
            };
        }
        if (fromPrice !== undefined && toPrice !== undefined) {
            classFilter['price'] = {
                $gte: fromPrice,
                $lte: toPrice
            };
        }
        const classes = await this.classRepository.model.aggregate([
            {
                $match: classFilter
            },
            {
                $lookup: {
                    from: 'learner-classes',
                    localField: '_id',
                    foreignField: 'classId',
                    as: 'learnerClasses',
                    pipeline: [
                        {
                            $match: learnerClassFilter
                        }
                    ]
                }
            },
            {
                $match: {
                    learnerClasses: { $ne: [] }
                }
            },
            {
                $addFields: {
                    learnerClass: {
                        $arrayElemAt: ['$learnerClasses', 0]
                    }
                }
            },
            {
                $project: {
                    learnerClasses: 0
                }
            },
            {
                $lookup: {
                    from: 'instructors',
                    localField: 'instructorId',
                    foreignField: '_id',
                    as: 'instructors'
                }
            },
            {
                $addFields: {
                    instructor: {
                        $arrayElemAt: ['$instructors', 0]
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    code: 1,
                    title: 1,
                    level: 1,
                    type: 1,
                    thumbnail: 1,
                    status: 1,
                    progress: 1,
                    instructor: {
                        name: 1
                    },
                    price: 1
                }
            },
            {
                $facet: {
                    count: [
                        {
                            $count: 'totalDocs'
                        }
                    ],
                    list: [
                        {
                            $sort: sort
                        },
                        {
                            $skip: (page - 1) * limit
                        },
                        {
                            $limit: limit
                        }
                    ]
                }
            }
        ]);
        const totalDocs = _.get(classes, '[0].count[0].totalDocs', 0);
        return this.helperService.convertDataToPaging({
            docs: classes[0].list,
            totalDocs,
            limit,
            page
        });
    }
};
exports.LearnerClassService = LearnerClassService;
exports.LearnerClassService = LearnerClassService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(learner_class_repository_1.ILearnerClassRepository)),
    __param(1, (0, common_1.Inject)(class_repository_1.IClassRepository)),
    __param(2, (0, mongoose_2.InjectConnection)()),
    __metadata("design:paramtypes", [Object, Object, mongoose_1.Connection,
        helper_service_1.HelperService])
], LearnerClassService);
//# sourceMappingURL=learner-class.service.js.map