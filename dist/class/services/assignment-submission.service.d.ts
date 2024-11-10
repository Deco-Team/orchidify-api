/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose-paginate-v2" />
import { AssignmentSubmission } from '@src/class/schemas/assignment-submission.schema';
import { FilterQuery, PopulateOptions, SaveOptions, UpdateQuery } from 'mongoose';
import { CreateAssignmentSubmissionDto } from '@class/dto/assignment-submission.dto';
import { IAssignmentSubmissionRepository } from '@class/repositories/assignment-submission.repository';
import { ILearnerClassRepository } from '@class/repositories/learner-class.repository';
import { QueryOptions } from 'mongoose';
export declare const IAssignmentSubmissionService: unique symbol;
export interface IAssignmentSubmissionService {
    create(createAssignmentSubmissionDto: CreateAssignmentSubmissionDto, options?: SaveOptions | undefined): Promise<AssignmentSubmission>;
    update(conditions: FilterQuery<AssignmentSubmission>, payload: UpdateQuery<AssignmentSubmission>, options?: QueryOptions | undefined): Promise<AssignmentSubmission>;
    findById(classId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<AssignmentSubmission>;
    findMyAssignmentSubmission(params: {
        assignmentId: string;
        learnerId: string;
    }): Promise<AssignmentSubmission>;
    list(querySubmissionDto: {
        classId: string;
        assignmentId: string;
    }): any;
}
export declare class AssignmentSubmissionService implements IAssignmentSubmissionService {
    private readonly assignmentSubmissionRepository;
    private readonly learnerClassRepository;
    constructor(assignmentSubmissionRepository: IAssignmentSubmissionRepository, learnerClassRepository: ILearnerClassRepository);
    create(createAssignmentSubmissionDto: CreateAssignmentSubmissionDto, options?: SaveOptions | undefined): Promise<import("mongoose").Document<unknown, {}, AssignmentSubmission> & AssignmentSubmission & Required<{
        _id: string;
    }>>;
    update(conditions: FilterQuery<AssignmentSubmission>, payload: UpdateQuery<AssignmentSubmission>, options?: QueryOptions | undefined): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AssignmentSubmission> & AssignmentSubmission & Required<{
        _id: string;
    }>> & Omit<import("mongoose").Document<unknown, {}, AssignmentSubmission> & AssignmentSubmission & Required<{
        _id: string;
    }>, never>>;
    findById(submissionId: string, projection?: string | Record<string, any>, populates?: Array<PopulateOptions>): Promise<import("mongoose").Document<unknown, {}, AssignmentSubmission> & AssignmentSubmission & Required<{
        _id: string;
    }>>;
    findMyAssignmentSubmission(params: {
        assignmentId: string;
        learnerId: string;
    }): Promise<import("mongoose").Document<unknown, {}, AssignmentSubmission> & AssignmentSubmission & Required<{
        _id: string;
    }>>;
    list(querySubmissionDto: {
        classId: string;
        assignmentId: string;
    }): Promise<{
        docs: any[];
    }>;
}
