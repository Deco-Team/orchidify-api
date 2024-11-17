"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FirebaseRepository_auth, _FirebaseRepository_firestore, _FirebaseRepository_messaging;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseRepository = exports.IFirebaseRepository = void 0;
const common_1 = require("@nestjs/common");
const firebase_admin_1 = require("firebase-admin");
exports.IFirebaseRepository = Symbol('IFirebaseRepository');
let FirebaseRepository = class FirebaseRepository {
    constructor(firebaseApp) {
        this.firebaseApp = firebaseApp;
        _FirebaseRepository_auth.set(this, void 0);
        _FirebaseRepository_firestore.set(this, void 0);
        _FirebaseRepository_messaging.set(this, void 0);
        __classPrivateFieldSet(this, _FirebaseRepository_auth, this.firebaseApp.auth(), "f");
        __classPrivateFieldSet(this, _FirebaseRepository_firestore, this.firebaseApp.firestore(), "f");
        __classPrivateFieldSet(this, _FirebaseRepository_messaging, this.firebaseApp.messaging(), "f");
    }
    getAuth() {
        return __classPrivateFieldGet(this, _FirebaseRepository_auth, "f");
    }
    getFirestore() {
        return __classPrivateFieldGet(this, _FirebaseRepository_firestore, "f");
    }
    getMessaging() {
        return __classPrivateFieldGet(this, _FirebaseRepository_messaging, "f");
    }
    getCollection(collectionName) {
        return __classPrivateFieldGet(this, _FirebaseRepository_firestore, "f").collection(collectionName);
    }
};
exports.FirebaseRepository = FirebaseRepository;
_FirebaseRepository_auth = new WeakMap();
_FirebaseRepository_firestore = new WeakMap();
_FirebaseRepository_messaging = new WeakMap();
exports.FirebaseRepository = FirebaseRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('FIREBASE_APP')),
    __metadata("design:paramtypes", [Object])
], FirebaseRepository);
//# sourceMappingURL=firebase.repository.js.map