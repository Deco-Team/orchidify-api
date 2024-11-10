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
var FeedbackService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = exports.IFeedbackService = void 0;
const common_1 = require("@nestjs/common");
const feedback_repository_1 = require("../repositories/feedback.repository");
const mongoose_1 = require("mongoose");
const constant_1 = require("../contracts/constant");
const app_logger_service_1 = require("../../common/services/app-logger.service");
const rating_summary_dto_1 = require("../../class/dto/rating-summary.dto");
const mongoose_2 = require("@nestjs/mongoose");
const dto_1 = require("../../common/contracts/dto");
const class_service_1 = require("../../class/services/class.service");
const course_service_1 = require("../../course/services/course.service");
exports.IFeedbackService = Symbol('IFeedbackService');
let FeedbackService = FeedbackService_1 = class FeedbackService {
    constructor(connection, feedbackRepository, classService, courseService) {
        this.connection = connection;
        this.feedbackRepository = feedbackRepository;
        this.classService = classService;
        this.courseService = courseService;
        this.appLogger = new app_logger_service_1.AppLogger(FeedbackService_1.name);
    }
    async sendFeedback(sendFeedbackDto, classRatingSummaryDto, courseRatingSummaryDto) {
        const { classId, courseId, rate } = sendFeedbackDto;
        const session = await this.connection.startSession();
        try {
            await session.withTransaction(async () => {
                await this.create(sendFeedbackDto, { session });
                let classTotalCountByRate;
                let classRatingSummary;
                let classRate;
                if (!classRatingSummaryDto) {
                    classTotalCountByRate = new rating_summary_dto_1.BaseRatingTotalCountByRateDto();
                    classTotalCountByRate[`${rate}`]++;
                    classRatingSummary = new rating_summary_dto_1.BaseRatingSummaryDto(rate, 1, classTotalCountByRate);
                    classRate = rate;
                }
                else {
                    const { totalSum, totalCount, totalCountByRate } = classRatingSummaryDto;
                    classTotalCountByRate = totalCountByRate;
                    classTotalCountByRate[`${rate}`]++;
                    classRatingSummary = new rating_summary_dto_1.BaseRatingSummaryDto(totalSum + rate, totalCount + 1, classTotalCountByRate);
                    classRate = Math.ceil((classRatingSummary.totalSum / classRatingSummary.totalCount) * 10) / 10;
                }
                await this.classService.update({ _id: classId }, {
                    $set: {
                        rate: classRate,
                        ratingSummary: classRatingSummary
                    }
                }, { session });
                let courseTotalCountByRate;
                let courseRatingSummary;
                let courseRate;
                if (!courseRatingSummaryDto) {
                    courseTotalCountByRate = new rating_summary_dto_1.BaseRatingTotalCountByRateDto();
                    courseTotalCountByRate[`${rate}`]++;
                    courseRatingSummary = new rating_summary_dto_1.BaseRatingSummaryDto(rate, 1, courseTotalCountByRate);
                    courseRate = rate;
                }
                else {
                    const { totalSum, totalCount, totalCountByRate } = courseRatingSummaryDto;
                    courseTotalCountByRate = totalCountByRate;
                    courseTotalCountByRate[`${rate}`]++;
                    courseRatingSummary = new rating_summary_dto_1.BaseRatingSummaryDto(totalSum + rate, totalCount + 1, courseTotalCountByRate);
                    courseRate = Math.ceil((courseRatingSummary.totalSum / courseRatingSummary.totalCount) * 10) / 10;
                }
                await this.courseService.update({ _id: courseId }, {
                    $set: {
                        rate: courseRate,
                        ratingSummary: courseRatingSummary
                    }
                }, { session });
            });
        }
        finally {
            await session.endSession();
        }
        return new dto_1.SuccessResponse(true);
    }
    async create(sendFeedbackDto, options) {
        return await this.feedbackRepository.create({ ...sendFeedbackDto }, options);
    }
    async update(conditions, payload, options) {
        return await this.feedbackRepository.findOneAndUpdate(conditions, payload, options);
    }
    async findById(feedbackId, projection, populates) {
        const feedback = await this.feedbackRepository.findOne({
            conditions: {
                _id: feedbackId
            },
            projection,
            populates
        });
        return feedback;
    }
    async findOneBy(conditions, projection, populates) {
        const feedback = await this.feedbackRepository.findOne({
            conditions,
            projection,
            populates
        });
        return feedback;
    }
    async findMany(conditions, projection, populates) {
        const feedbacks = await this.feedbackRepository.findMany({
            conditions,
            projection,
            populates
        });
        return feedbacks;
    }
    async list(pagination, queryFeedbackDto, projection = constant_1.FEEDBACK_LIST_PROJECTION, populate) {
        const { rate, courseId } = queryFeedbackDto;
        const filter = {};
        if (courseId) {
            filter['courseId'] = new mongoose_1.Types.ObjectId(courseId);
        }
        if (rate) {
            filter['rate'] = rate;
        }
        return this.feedbackRepository.model.paginate(filter, {
            ...pagination,
            projection,
            populate
        });
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = FeedbackService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectConnection)()),
    __param(1, (0, common_1.Inject)(feedback_repository_1.IFeedbackRepository)),
    __param(2, (0, common_1.Inject)(class_service_1.IClassService)),
    __param(3, (0, common_1.Inject)(course_service_1.ICourseService)),
    __metadata("design:paramtypes", [mongoose_1.Connection, Object, Object, Object])
], FeedbackService);
//# sourceMappingURL=feedback.service.js.map