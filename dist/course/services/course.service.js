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
exports.CourseService = exports.ICourseService = void 0;
const common_1 = require("@nestjs/common");
const course_repository_1 = require("../repositories/course.repository");
const mongoose_1 = require("mongoose");
const constant_1 = require("../../common/contracts/constant");
const constant_2 = require("../contracts/constant");
const constant_3 = require("../../common/contracts/constant");
const _ = require("lodash");
const helper_service_1 = require("../../common/services/helper.service");
const constant_4 = require("../../instructor/contracts/constant");
const learner_class_service_1 = require("../../class/services/learner-class.service");
const config_1 = require("../../config");
exports.ICourseService = Symbol('ICourseService');
let CourseService = class CourseService {
    constructor(helperService, courseRepository, learnerClassService) {
        this.helperService = helperService;
        this.courseRepository = courseRepository;
        this.learnerClassService = learnerClassService;
    }
    async create(createCourseDto, options) {
        createCourseDto['code'] = await this.generateCode();
        const course = await this.courseRepository.create(createCourseDto, options);
        return course;
    }
    async findById(courseId, projection, populates) {
        const course = await this.courseRepository.findOne({
            conditions: {
                _id: courseId,
                childCourseIds: []
            },
            projection,
            populates
        });
        return course;
    }
    update(conditions, payload, options) {
        return this.courseRepository.findOneAndUpdate(conditions, payload, options);
    }
    async listByInstructor(instructorId, pagination, queryCourseDto, projection = constant_2.COURSE_LIST_PROJECTION) {
        const { title, type, level, status } = queryCourseDto;
        const filter = {
            instructorId: new mongoose_1.Types.ObjectId(instructorId),
            status: {
                $ne: constant_1.CourseStatus.DELETED
            },
            childCourseIds: []
        };
        const validLevel = level?.filter((level) => [constant_3.CourseLevel.BASIC, constant_3.CourseLevel.INTERMEDIATE, constant_3.CourseLevel.ADVANCED].includes(level));
        if (validLevel?.length > 0) {
            filter['level'] = {
                $in: validLevel
            };
        }
        const validStatus = status?.filter((status) => [constant_1.CourseStatus.DRAFT, constant_1.CourseStatus.ACTIVE].includes(status));
        if (validStatus?.length > 0) {
            filter['status'] = {
                $in: validStatus
            };
        }
        if (title) {
            filter['$text'] = {
                $search: title
            };
        }
        if (type) {
            filter['type'] = type;
        }
        return this.courseRepository.model.paginate(filter, {
            ...pagination,
            projection
        });
    }
    async listByStaff(pagination, queryCourseDto, projection = constant_2.COURSE_LIST_PROJECTION) {
        const { title, type, level, status } = queryCourseDto;
        const filter = {
            status: {
                $in: [constant_1.CourseStatus.ACTIVE]
            },
            childCourseIds: []
        };
        const validLevel = level?.filter((level) => [constant_3.CourseLevel.BASIC, constant_3.CourseLevel.INTERMEDIATE, constant_3.CourseLevel.ADVANCED].includes(level));
        if (validLevel?.length > 0) {
            filter['level'] = {
                $in: validLevel
            };
        }
        const validStatus = status?.filter((status) => [constant_1.CourseStatus.ACTIVE].includes(status));
        if (validStatus?.length > 0) {
            filter['status'] = {
                $in: validStatus
            };
        }
        if (title) {
            filter['$text'] = {
                $search: title
            };
        }
        if (type) {
            filter['type'] = type;
        }
        return this.courseRepository.model.paginate(filter, {
            ...pagination,
            projection,
            populate: [
                {
                    path: 'instructor',
                    select: constant_4.COURSE_INSTRUCTOR_DETAIL_PROJECTION
                }
            ]
        });
    }
    async listPublicCourses(pagination, queryCourseDto) {
        const { title, type, level, fromPrice, toPrice } = queryCourseDto;
        const { sort, limit, page } = pagination;
        const aggregateMatch = [];
        if (title?.trim()) {
            aggregateMatch.push({
                $match: {
                    $text: {
                        $search: title.trim()
                    }
                }
            });
        }
        if (type?.trim()) {
            aggregateMatch.push({
                $match: {
                    type: {
                        $all: type.trim().split(', ')
                    }
                }
            });
        }
        const validLevel = level?.filter((level) => [constant_3.CourseLevel.BASIC, constant_3.CourseLevel.INTERMEDIATE, constant_3.CourseLevel.ADVANCED].includes(level));
        if (validLevel?.length > 0) {
            aggregateMatch.push({
                $match: {
                    level: {
                        $in: validLevel
                    }
                }
            });
        }
        if (fromPrice !== undefined && toPrice !== undefined) {
            aggregateMatch.push({
                $match: {
                    price: {
                        $gte: fromPrice,
                        $lte: toPrice
                    }
                }
            });
        }
        aggregateMatch.push({
            $match: {
                childCourseIds: []
            }
        });
        const result = await this.courseRepository.model.aggregate([
            ...aggregateMatch,
            {
                $project: {
                    _id: 1,
                    code: 1,
                    title: 1,
                    price: 1,
                    level: 1,
                    type: 1,
                    duration: 1,
                    thumbnail: 1,
                    status: 1,
                    learnerLimit: 1,
                    rate: 1,
                    discount: 1,
                    instructorId: 1,
                    isRequesting: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $lookup: {
                    from: 'classes',
                    localField: '_id',
                    foreignField: 'courseId',
                    as: 'classes',
                    pipeline: [
                        {
                            $match: {
                                status: constant_1.ClassStatus.PUBLISHED
                            }
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        }
                    ]
                }
            },
            {
                $match: {
                    classes: {
                        $exists: true,
                        $ne: []
                    }
                }
            },
            {
                $lookup: {
                    from: 'instructors',
                    localField: 'instructorId',
                    foreignField: '_id',
                    as: 'instructors',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                idCardPhoto: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    instructor: {
                        $arrayElemAt: ['$instructors', 0]
                    },
                    classesCount: {
                        $reduce: {
                            input: {
                                $ifNull: ['$classes', []]
                            },
                            initialValue: 0,
                            in: {
                                $add: ['$$value', 1]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    classes: 0,
                    instructors: 0
                }
            },
            {
                $sort: sort
            },
            {
                $facet: {
                    list: [
                        {
                            $skip: (page - 1) * limit
                        },
                        {
                            $limit: limit
                        }
                    ],
                    count: [
                        {
                            $count: 'totalDocs'
                        }
                    ]
                }
            }
        ]);
        const totalDocs = _.get(result, '[0].count[0].totalDocs', 0);
        return this.helperService.convertDataToPaging({
            docs: result[0].list,
            totalDocs,
            limit,
            page
        });
    }
    async listByLearner(pagination, queryCourseDto, userAuth) {
        const { title, type, level, fromPrice, toPrice } = queryCourseDto;
        const { sort, limit, page } = pagination;
        const aggregateMatch = [];
        if (title?.trim()) {
            aggregateMatch.push({
                $match: {
                    $text: {
                        $search: title.trim()
                    }
                }
            });
        }
        if (type?.trim()) {
            aggregateMatch.push({
                $match: {
                    type: {
                        $all: type.trim().split(', ')
                    }
                }
            });
        }
        const validLevel = level?.filter((level) => [constant_3.CourseLevel.BASIC, constant_3.CourseLevel.INTERMEDIATE, constant_3.CourseLevel.ADVANCED].includes(level));
        if (validLevel?.length > 0) {
            aggregateMatch.push({
                $match: {
                    level: {
                        $in: validLevel
                    }
                }
            });
        }
        if (fromPrice !== undefined && toPrice !== undefined) {
            aggregateMatch.push({
                $match: {
                    price: {
                        $gte: fromPrice,
                        $lte: toPrice
                    }
                }
            });
        }
        aggregateMatch.push({
            $match: {
                childCourseIds: []
            }
        });
        const { _id: learnerId } = userAuth || {};
        const learnerClasses = await this.learnerClassService.findMany({
            learnerId: new mongoose_1.Types.ObjectId(learnerId)
        });
        const learnedCourseIdSet = new Set(learnerClasses.map((learnerClass) => learnerClass.courseId.toString()));
        const result = await this.courseRepository.model.aggregate([
            ...aggregateMatch,
            {
                $project: {
                    _id: 1,
                    code: 1,
                    title: 1,
                    price: 1,
                    level: 1,
                    type: 1,
                    duration: 1,
                    thumbnail: 1,
                    status: 1,
                    learnerLimit: 1,
                    rate: 1,
                    discount: 1,
                    instructorId: 1,
                    isRequesting: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $lookup: {
                    from: 'classes',
                    localField: '_id',
                    foreignField: 'courseId',
                    as: 'classes',
                    pipeline: [
                        {
                            $match: {
                                status: constant_1.ClassStatus.PUBLISHED
                            }
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        }
                    ]
                }
            },
            {
                $match: {
                    classes: {
                        $exists: true,
                        $ne: []
                    }
                }
            },
            {
                $lookup: {
                    from: 'instructors',
                    localField: 'instructorId',
                    foreignField: '_id',
                    as: 'instructors',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                idCardPhoto: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    instructor: {
                        $arrayElemAt: ['$instructors', 0]
                    },
                    classesCount: {
                        $reduce: {
                            input: {
                                $ifNull: ['$classes', []]
                            },
                            initialValue: 0,
                            in: {
                                $add: ['$$value', 1]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    classes: 0,
                    instructors: 0
                }
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: 'childCourseIds',
                    as: 'combos',
                    let: { childCourseId: '$_id' },
                    pipeline: [
                        { $match: { status: constant_1.CourseStatus.ACTIVE } },
                        {
                            $project: {
                                childCourseIds: 1,
                                discount: 1
                            }
                        }
                    ]
                }
            },
            {
                $sort: sort
            },
            {
                $facet: {
                    list: [
                        {
                            $skip: (page - 1) * limit
                        },
                        {
                            $limit: limit
                        }
                    ],
                    count: [
                        {
                            $count: 'totalDocs'
                        }
                    ]
                }
            }
        ]);
        const totalDocs = _.get(result, '[0].count[0].totalDocs', 0);
        const docs = [];
        for (const course of result[0].list) {
            const combos = _.get(course, 'combos');
            let discount = 0;
            if (combos.length !== 0) {
                const clonedCourseIdSet = new Set([...learnedCourseIdSet]);
                clonedCourseIdSet.delete(course._id.toString());
                for (const combo of combos) {
                    const matchedCourseIds = combo.childCourseIds.filter((childCourseId) => {
                        return childCourseId.toString() !== course._id.toString() && clonedCourseIdSet.has(childCourseId.toString());
                    });
                    if (matchedCourseIds.length > 0) {
                        const newDiscount = combo.discount;
                        discount = newDiscount > discount ? newDiscount : discount;
                    }
                }
            }
            _.set(course, 'discount', discount);
            let finalPrice = Math.round((_.get(course, 'price') * (100 - discount)) / 100);
            finalPrice = finalPrice < config_1.MIN_PRICE ? config_1.MIN_PRICE : finalPrice;
            _.set(course, 'finalPrice', finalPrice);
            _.unset(course, 'combos');
            docs.push(course);
        }
        return this.helperService.convertDataToPaging({
            docs: result[0].list,
            totalDocs,
            limit,
            page
        });
    }
    async listBestSellerCoursesByLearner(pagination, queryCourseDto, userAuth) {
        const { title, type, level, fromPrice, toPrice } = queryCourseDto;
        const { limit, page } = pagination;
        const sort = {
            learnerQuantity: -1,
            createdAt: -1
        };
        const aggregateMatch = [];
        if (title?.trim()) {
            aggregateMatch.push({
                $match: {
                    $text: {
                        $search: title.trim()
                    }
                }
            });
        }
        if (type?.trim()) {
            aggregateMatch.push({
                $match: {
                    type: {
                        $all: type.trim().split(', ')
                    }
                }
            });
        }
        const validLevel = level?.filter((level) => [constant_3.CourseLevel.BASIC, constant_3.CourseLevel.INTERMEDIATE, constant_3.CourseLevel.ADVANCED].includes(level));
        if (validLevel?.length > 0) {
            aggregateMatch.push({
                $match: {
                    level: {
                        $in: validLevel
                    }
                }
            });
        }
        if (fromPrice !== undefined && toPrice !== undefined) {
            aggregateMatch.push({
                $match: {
                    price: {
                        $gte: fromPrice,
                        $lte: toPrice
                    }
                }
            });
        }
        aggregateMatch.push({
            $match: {
                childCourseIds: []
            }
        });
        const { _id: learnerId } = userAuth || {};
        const learnerClasses = await this.learnerClassService.findMany({
            learnerId: new mongoose_1.Types.ObjectId(learnerId)
        });
        const learnedCourseIdSet = new Set(learnerClasses.map((learnerClass) => learnerClass.courseId.toString()));
        const result = await this.courseRepository.model.aggregate([
            ...aggregateMatch,
            {
                $project: {
                    _id: 1,
                    code: 1,
                    title: 1,
                    price: 1,
                    level: 1,
                    type: 1,
                    duration: 1,
                    thumbnail: 1,
                    status: 1,
                    learnerLimit: 1,
                    learnerQuantity: 1,
                    rate: 1,
                    discount: 1,
                    instructorId: 1,
                    isRequesting: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $lookup: {
                    from: 'classes',
                    localField: '_id',
                    foreignField: 'courseId',
                    as: 'classes',
                    pipeline: [
                        {
                            $match: {
                                status: constant_1.ClassStatus.PUBLISHED
                            }
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        }
                    ]
                }
            },
            {
                $match: {
                    classes: {
                        $exists: true,
                        $ne: []
                    }
                }
            },
            {
                $lookup: {
                    from: 'instructors',
                    localField: 'instructorId',
                    foreignField: '_id',
                    as: 'instructors',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                idCardPhoto: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    instructor: {
                        $arrayElemAt: ['$instructors', 0]
                    },
                    classesCount: {
                        $reduce: {
                            input: {
                                $ifNull: ['$classes', []]
                            },
                            initialValue: 0,
                            in: {
                                $add: ['$$value', 1]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    classes: 0,
                    instructors: 0
                }
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: 'childCourseIds',
                    as: 'combos',
                    let: { childCourseId: '$_id' },
                    pipeline: [
                        { $match: { status: constant_1.CourseStatus.ACTIVE } },
                        {
                            $project: {
                                childCourseIds: 1,
                                discount: 1
                            }
                        }
                    ]
                }
            },
            {
                $sort: sort
            },
            {
                $facet: {
                    list: [
                        {
                            $skip: (page - 1) * limit
                        },
                        {
                            $limit: limit
                        }
                    ],
                    count: [
                        {
                            $count: 'totalDocs'
                        }
                    ]
                }
            }
        ]);
        const totalDocs = _.get(result, '[0].count[0].totalDocs', 0);
        const docs = [];
        for (const course of result[0].list) {
            const combos = _.get(course, 'combos');
            let discount = 0;
            if (combos.length !== 0) {
                const clonedCourseIdSet = new Set([...learnedCourseIdSet]);
                clonedCourseIdSet.delete(course._id.toString());
                for (const combo of combos) {
                    const matchedCourseIds = combo.childCourseIds.filter((childCourseId) => {
                        return childCourseId.toString() !== course._id.toString() && clonedCourseIdSet.has(childCourseId.toString());
                    });
                    if (matchedCourseIds.length > 0) {
                        const newDiscount = combo.discount;
                        discount = newDiscount > discount ? newDiscount : discount;
                    }
                }
            }
            _.set(course, 'discount', discount);
            let finalPrice = Math.round((_.get(course, 'price') * (100 - discount)) / 100);
            finalPrice = finalPrice < config_1.MIN_PRICE ? config_1.MIN_PRICE : finalPrice;
            _.set(course, 'finalPrice', finalPrice);
            _.unset(course, 'combos');
            docs.push(course);
        }
        return this.helperService.convertDataToPaging({
            docs: result[0].list,
            totalDocs,
            limit,
            page
        });
    }
    async listRecommendedCoursesByLearner(pagination, queryCourseDto, userAuth) {
        const { title, type, level, fromPrice, toPrice } = queryCourseDto;
        const { limit, page } = pagination;
        const sort = {
            'combos.discount': -1,
            createdAt: -1
        };
        const aggregateMatch = [];
        if (title?.trim()) {
            aggregateMatch.push({
                $match: {
                    $text: {
                        $search: title.trim()
                    }
                }
            });
        }
        if (type?.trim()) {
            aggregateMatch.push({
                $match: {
                    type: {
                        $all: type.trim().split(', ')
                    }
                }
            });
        }
        const validLevel = level?.filter((level) => [constant_3.CourseLevel.BASIC, constant_3.CourseLevel.INTERMEDIATE, constant_3.CourseLevel.ADVANCED].includes(level));
        if (validLevel?.length > 0) {
            aggregateMatch.push({
                $match: {
                    level: {
                        $in: validLevel
                    }
                }
            });
        }
        if (fromPrice !== undefined && toPrice !== undefined) {
            aggregateMatch.push({
                $match: {
                    price: {
                        $gte: fromPrice,
                        $lte: toPrice
                    }
                }
            });
        }
        aggregateMatch.push({
            $match: {
                childCourseIds: []
            }
        });
        const { _id: learnerId } = userAuth || {};
        const learnerClasses = await this.learnerClassService.findMany({
            learnerId: new mongoose_1.Types.ObjectId(learnerId)
        });
        const learnedCourseIdSet = new Set(learnerClasses.map((learnerClass) => learnerClass.courseId.toString()));
        const result = await this.courseRepository.model.aggregate([
            ...aggregateMatch,
            {
                $project: {
                    _id: 1,
                    code: 1,
                    title: 1,
                    price: 1,
                    level: 1,
                    type: 1,
                    duration: 1,
                    thumbnail: 1,
                    status: 1,
                    learnerLimit: 1,
                    learnerQuantity: 1,
                    rate: 1,
                    discount: 1,
                    instructorId: 1,
                    isRequesting: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $lookup: {
                    from: 'classes',
                    localField: '_id',
                    foreignField: 'courseId',
                    as: 'classes',
                    pipeline: [
                        {
                            $match: {
                                status: constant_1.ClassStatus.PUBLISHED
                            }
                        },
                        {
                            $project: {
                                _id: 1
                            }
                        }
                    ]
                }
            },
            {
                $match: {
                    classes: {
                        $exists: true,
                        $ne: []
                    }
                }
            },
            {
                $lookup: {
                    from: 'instructors',
                    localField: 'instructorId',
                    foreignField: '_id',
                    as: 'instructors',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                idCardPhoto: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    instructor: {
                        $arrayElemAt: ['$instructors', 0]
                    },
                    classesCount: {
                        $reduce: {
                            input: {
                                $ifNull: ['$classes', []]
                            },
                            initialValue: 0,
                            in: {
                                $add: ['$$value', 1]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    classes: 0,
                    instructors: 0
                }
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: 'childCourseIds',
                    as: 'combos',
                    let: { childCourseId: '$_id' },
                    pipeline: [
                        { $match: { status: constant_1.CourseStatus.ACTIVE } },
                        {
                            $project: {
                                childCourseIds: 1,
                                discount: 1
                            }
                        }
                    ]
                }
            },
            {
                $sort: sort
            },
            {
                $facet: {
                    list: [
                        {
                            $skip: (page - 1) * limit
                        },
                        {
                            $limit: limit
                        }
                    ],
                    count: [
                        {
                            $count: 'totalDocs'
                        }
                    ]
                }
            }
        ]);
        const totalDocs = _.get(result, '[0].count[0].totalDocs', 0);
        const docs = [];
        for (const course of result[0].list) {
            const combos = _.get(course, 'combos');
            let discount = 0;
            if (combos.length !== 0) {
                const clonedCourseIdSet = new Set([...learnedCourseIdSet]);
                clonedCourseIdSet.delete(course._id.toString());
                for (const combo of combos) {
                    const matchedCourseIds = combo.childCourseIds.filter((childCourseId) => {
                        return childCourseId.toString() !== course._id.toString() && clonedCourseIdSet.has(childCourseId.toString());
                    });
                    if (matchedCourseIds.length > 0) {
                        const newDiscount = combo.discount;
                        discount = newDiscount > discount ? newDiscount : discount;
                    }
                }
            }
            _.set(course, 'discount', discount);
            let finalPrice = Math.round((_.get(course, 'price') * (100 - discount)) / 100);
            finalPrice = finalPrice < config_1.MIN_PRICE ? config_1.MIN_PRICE : finalPrice;
            _.set(course, 'finalPrice', finalPrice);
            _.unset(course, 'combos');
            docs.push(course);
        }
        docs.sort((courseA, courseB) => courseB['discount'] - courseA['discount']);
        return this.helperService.convertDataToPaging({
            docs: result[0].list,
            totalDocs,
            limit,
            page
        });
    }
    async findManyByStatus(status) {
        const courses = await this.courseRepository.findMany({
            conditions: {
                status: {
                    $in: status
                },
                childCourseIds: []
            }
        });
        return courses;
    }
    async findMany(conditions, projection, populates) {
        const courses = await this.courseRepository.findMany({
            conditions: {
                ...conditions,
                childCourseIds: []
            },
            projection,
            populates
        });
        return courses;
    }
    async viewReportCourseByRate() {
        return this.courseRepository.model.aggregate([
            {
                $match: {
                    status: constant_1.CourseStatus.ACTIVE,
                    childCourseIds: []
                }
            },
            {
                $bucket: {
                    groupBy: '$rate',
                    boundaries: [0, 1, 2, 3, 4, 5.1]
                }
            }
        ]);
    }
    async generateCode() {
        const prefix = `OCP`;
        const lastRecord = await this.courseRepository.model.findOne().sort({ createdAt: -1 });
        const number = parseInt(_.get(lastRecord, 'code', `${prefix}000`).split(prefix)[1]) + 1;
        return `${prefix}${number.toString().padStart(3, '0')}`;
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(course_repository_1.ICourseRepository)),
    __param(2, (0, common_1.Inject)(learner_class_service_1.ILearnerClassService)),
    __metadata("design:paramtypes", [helper_service_1.HelperService, Object, Object])
], CourseService);
//# sourceMappingURL=course.service.js.map