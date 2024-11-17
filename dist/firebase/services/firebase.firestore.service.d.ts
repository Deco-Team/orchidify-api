import { IFirebaseRepository } from '@firebase/repositories/firebase.repository';
export declare const IFirebaseFirestoreService: unique symbol;
export interface IFirebaseFirestoreService {
    getCollection(collectionName: string): Promise<FirebaseFirestore.CollectionReference>;
}
export declare class FirebaseFirestoreService implements IFirebaseFirestoreService {
    private readonly firebaseRepository;
    private readonly appLogger;
    constructor(firebaseRepository: IFirebaseRepository);
    getCollection(collectionName: string): Promise<FirebaseFirestore.CollectionReference>;
}
