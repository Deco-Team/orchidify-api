import { IClassRepository } from '@src/class/repositories/class.repository';
import { Assignment } from '@src/class/schemas/assignment.schema';
import { UpdateAssignmentDto } from '@class/dto/assignment.dto';
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
    updateAssignment(params: {
        assignmentId: string;
        classId: string;
        instructorId?: string;
        updateAssignmentDto: UpdateAssignmentDto;
    }): Promise<void>;
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
    updateAssignment(params: {
        assignmentId: string;
        classId: string;
        instructorId?: string;
        updateAssignmentDto: UpdateAssignmentDto;
    }): Promise<void>;
}
