import { Assignment } from '@src/class/schemas/assignment.schema';
import { ICourseRepository } from '@course/repositories/course.repository';
export declare const ICourseAssignmentService: unique symbol;
export interface ICourseAssignmentService {
    findOneBy(params: {
        assignmentId: string;
        courseId: string;
        instructorId?: string;
    }): Promise<Assignment>;
}
export declare class CourseAssignmentService implements ICourseAssignmentService {
    private readonly courseRepository;
    constructor(courseRepository: ICourseRepository);
    findOneBy(params: {
        assignmentId: string;
        courseId: string;
        instructorId?: string;
    }): Promise<Assignment>;
}
