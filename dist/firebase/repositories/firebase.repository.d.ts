import { app, auth, messaging } from 'firebase-admin';
export declare const IFirebaseRepository: unique symbol;
export interface IFirebaseRepository {
    getAuth(): auth.Auth;
    getFirestore(): FirebaseFirestore.Firestore;
    getMessaging(): messaging.Messaging;
    getCollection(collectionName: string): FirebaseFirestore.CollectionReference;
}
export declare class FirebaseRepository {
    #private;
    private firebaseApp;
    constructor(firebaseApp: app.App);
    getAuth(): import("firebase-admin/lib/auth/auth").Auth;
    getFirestore(): FirebaseFirestore.Firestore;
    getMessaging(): import("firebase-admin/lib/messaging/messaging").Messaging;
    getCollection(collectionName: string): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>;
}
