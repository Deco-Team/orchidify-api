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
exports.AssignmentSubmissionService = exports.IAssignmentSubmissionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const assignment_submission_repository_1 = require("../repositories/assignment-submission.repository");
const constant_1 = require("../../common/contracts/constant");
const learner_class_repository_1 = require("../repositories/learner-class.repository");
exports.IAssignmentSubmissionService = Symbol('IAssignmentSubmissionService');
let AssignmentSubmissionService = class AssignmentSubmissionService {
    constructor(assignmentSubmissionRepository, learnerClassRepository) {
        this.assignmentSubmissionRepository = assignmentSubmissionRepository;
        this.learnerClassRepository = learnerClassRepository;
    }
    async create(createAssignmentSubmissionDto, options) {
        const { assignmentId, learnerId, classId } = createAssignmentSubmissionDto;
        const assignmentSubmission = await this.assignmentSubmissionRepository.create({
            ...createAssignmentSubmissionDto,
            assignmentId: new mongoose_1.Types.ObjectId(assignmentId),
            learnerId: new mongoose_1.Types.ObjectId(learnerId),
            classId: new mongoose_1.Types.ObjectId(classId),
            status: constant_1.SubmissionStatus.SUBMITTED
        }, options);
        return assignmentSubmission;
    }
    update(conditions, payload, options) {
        return this.assignmentSubmissionRepository.findOneAndUpdate(conditions, payload, options);
    }
    async findById(submissionId, projection, populates) {
        const submission = await this.assignmentSubmissionRepository.findOne({
            conditions: {
                _id: submissionId
            },
            projection,
            populates
        });
        return submission;
    }
    async findMyAssignmentSubmission(params) {
        const { assignmentId, learnerId } = params;
        const assignmentSubmission = await this.assignmentSubmissionRepository.findOne({
            conditions: {
                assignmentId: new mongoose_1.Types.ObjectId(assignmentId),
                learnerId: new mongoose_1.Types.ObjectId(learnerId)
            }
        });
        return assignmentSubmission;
    }
    async list(querySubmissionDto) {
        const { classId, assignmentId } = querySubmissionDto;
        const submissions = await this.learnerClassRepository.model.aggregate([
            {
                $match: {
                    classId: new mongoose_1.Types.ObjectId(classId)
                }
            },
            {
                $project: {
                    learnerId: 1,
                    classId: 1
                }
            },
            {
                $lookup: {
                    from: 'assignment-submissions',
                    localField: 'classId',
                    foreignField: 'classId',
                    as: 'submissions',
                    let: {
                        learnerId: '$learnerId',
                        classId: '$classId'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ['$learnerId', '$$learnerId']
                                        },
                                        {
                                            $eq: ['$classId', '$$classId']
                                        },
                                        {
                                            $eq: ['$assignmentId', new mongoose_1.Types.ObjectId(assignmentId)]
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'learners',
                    localField: 'learnerId',
                    foreignField: '_id',
                    as: 'learners',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                email: 1,
                                avatar: 1,
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    learner: {
                        $arrayElemAt: ['$learners', 0]
                    },
                    submission: {
                        $arrayElemAt: ['$submissions', 0]
                    }
                }
            },
            {
                $project: {
                    submissions: 0,
                    learners: 0
                }
            }
        ]);
        return { docs: submissions };
    }
};
exports.AssignmentSubmissionService = AssignmentSubmissionService;
exports.AssignmentSubmissionService = AssignmentSubmissionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(assignment_submission_repository_1.IAssignmentSubmissionRepository)),
    __param(1, (0, common_1.Inject)(learner_class_repository_1.ILearnerClassRepository)),
    __metadata("design:paramtypes", [Object, Object])
], AssignmentSubmissionService);
//# sourceMappingURL=assignment-submission.service.js.map