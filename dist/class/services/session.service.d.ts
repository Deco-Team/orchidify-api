import { IClassRepository } from '@src/class/repositories/class.repository';
import { Session } from '@class/schemas/session.schema';
import { ILearnerClassService } from './learner-class.service';
export declare const ISessionService: unique symbol;
export interface ISessionService {
    findOneBy(params: {
        sessionId: string;
        classId: string;
        instructorId?: string;
    }): Promise<Session>;
    findMySession(params: {
        sessionId: string;
        classId: string;
        learnerId: string;
    }): Promise<Session>;
}
export declare class SessionService implements ISessionService {
    private readonly classRepository;
    private readonly learnerClassService;
    constructor(classRepository: IClassRepository, learnerClassService: ILearnerClassService);
    findOneBy(params: {
        sessionId: string;
        classId: string;
        instructorId?: string;
    }): Promise<Session>;
    findMySession(params: {
        sessionId: string;
        classId: string;
        learnerId: string;
    }): Promise<Session>;
}
