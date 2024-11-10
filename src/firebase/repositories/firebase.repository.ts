import { Inject, Injectable } from '@nestjs/common'
import { app, auth } from 'firebase-admin'

export const IFirebaseRepository = Symbol('IFirebaseRepository')

export interface IFirebaseRepository {
  getAuth(): auth.Auth
  getFirestore(): FirebaseFirestore.Firestore
}

@Injectable()
export class FirebaseRepository {
  #auth: auth.Auth
  #firestore: FirebaseFirestore.Firestore
  // #collection: FirebaseFirestore.CollectionReference;

  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
    this.#auth = this.firebaseApp.auth()
    this.#firestore = this.firebaseApp.firestore()
    // this.#collection = this.#firestore.collection('<collection_name>');
  }

  getAuth() {
    return this.#auth
  }

  getFirestore() {
    return this.#firestore
  }
}
