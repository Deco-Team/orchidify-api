import { IClassRepository } from '@src/class/repositories/class.repository';
import { Assignment } from '@src/class/schemas/assignment.schema';
export declare const IAssignmentService: unique symbol;
export interface IAssignmentService {
    findOneBy(params: {
        assignmentId: string;
        classId: string;
        instructorId?: string;
    }): Promise<Assignment>;
    findMyAssignment(params: {
        assignmentId: string;
        classId: string;
        learnerId: string;
    }): Promise<Assignment>;
}
export declare class AssignmentService implements IAssignmentService {
    private readonly classRepository;
    constructor(classRepository: IClassRepository);
    findOneBy(params: {
        assignmentId: string;
        classId: string;
        instructorId?: string;
    }): Promise<Assignment>;
    findMyAssignment(params: {
        assignmentId: string;
        classId: string;
        learnerId: string;
    }): Promise<Assignment>;
}
