import { IFirebaseRepository } from '@firebase/repositories/firebase.repository';
import { UserAuth } from '@common/contracts/dto';
import { IInstructorService } from '@instructor/services/instructor.service';
import { ILearnerService } from '@learner/services/learner.service';
export declare const IFirebaseAuthService: unique symbol;
export interface IFirebaseAuthService {
    createCustomToken(userAuth: UserAuth): Promise<string>;
}
export declare class FirebaseAuthService implements IFirebaseAuthService {
    private readonly firebaseRepository;
    private readonly instructorService;
    private readonly learnerService;
    private readonly appLogger;
    constructor(firebaseRepository: IFirebaseRepository, instructorService: IInstructorService, learnerService: ILearnerService);
    createCustomToken(userAuth: UserAuth): Promise<string>;
}
