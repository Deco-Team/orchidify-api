import { Session } from '@class/schemas/session.schema';
import { ICourseRepository } from '@course/repositories/course.repository';
export declare const ICourseSessionService: unique symbol;
export interface ICourseSessionService {
    findOneBy(params: {
        sessionId: string;
        courseId: string;
        instructorId?: string;
    }): Promise<Session>;
}
export declare class CourseSessionService implements ICourseSessionService {
    private readonly courseRepository;
    constructor(courseRepository: ICourseRepository);
    findOneBy(params: {
        sessionId: string;
        courseId: string;
        instructorId?: string;
    }): Promise<Session>;
}
