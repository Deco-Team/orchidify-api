import { IFirebaseService } from '@firebase/services/firebase.service';
export declare class FirebaseController {
    private readonly firebaseService;
    constructor(firebaseService: IFirebaseService);
    createCustomToken(req: any): Promise<{
        token: string;
    }>;
}
