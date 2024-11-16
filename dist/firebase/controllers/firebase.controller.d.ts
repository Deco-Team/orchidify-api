import { IFirebaseAuthService } from '@firebase/services/firebase.auth.service';
export declare class FirebaseController {
    private readonly firebaseService;
    constructor(firebaseService: IFirebaseAuthService);
    createCustomToken(req: any): Promise<{
        token: string;
    }>;
}
