import { BaseMediaDto } from '@media/dto/base-media.dto';
import { SubmissionStatus } from '@common/contracts/constant';
export declare class BaseAssignmentSubmissionDto {
    _id: string;
    attachments: BaseMediaDto[];
    point: number;
    feedback: string;
    status: SubmissionStatus;
    assignmentId: string;
    classId: string;
    learnerId: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const CreateAssignmentSubmissionDto_base: import("@nestjs/common").Type<Pick<BaseAssignmentSubmissionDto, "attachments" | "assignmentId">>;
export declare class CreateAssignmentSubmissionDto extends CreateAssignmentSubmissionDto_base {
    learnerId: string;
    classId: string;
}
declare const GradeAssignmentSubmissionDto_base: import("@nestjs/common").Type<Pick<BaseAssignmentSubmissionDto, "point" | "feedback">>;
export declare class GradeAssignmentSubmissionDto extends GradeAssignmentSubmissionDto_base {
}
export {};
