import { app, auth } from 'firebase-admin';
export declare const IFirebaseRepository: unique symbol;
export interface IFirebaseRepository {
    getAuth(): auth.Auth;
    getFirestore(): FirebaseFirestore.Firestore;
}
export declare class FirebaseRepository {
    #private;
    private firebaseApp;
    constructor(firebaseApp: app.App);
    getAuth(): import("firebase-admin/lib/auth/auth").Auth;
    getFirestore(): FirebaseFirestore.Firestore;
}
