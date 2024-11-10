import { IFirebaseRepository } from '@firebase/repositories/firebase.repository';
import { UserAuth } from '@common/contracts/dto';
import { IInstructorService } from '@instructor/services/instructor.service';
import { ILearnerService } from '@learner/services/learner.service';
export declare const IFirebaseService: unique symbol;
export interface IFirebaseService {
    createCustomToken(userAuth: UserAuth): Promise<string>;
}
export declare class FirebaseService implements IFirebaseService {
    private readonly firebaseRepository;
    private readonly instructorService;
    private readonly learnerService;
    private readonly appLogger;
    constructor(firebaseRepository: IFirebaseRepository, instructorService: IInstructorService, learnerService: ILearnerService);
    createCustomToken(userAuth: UserAuth): Promise<string>;
}
