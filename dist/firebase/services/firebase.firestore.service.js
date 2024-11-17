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
var FirebaseFirestoreService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseFirestoreService = exports.IFirebaseFirestoreService = void 0;
const common_1 = require("@nestjs/common");
const firebase_repository_1 = require("../repositories/firebase.repository");
const app_logger_service_1 = require("../../common/services/app-logger.service");
exports.IFirebaseFirestoreService = Symbol('IFirebaseFirestoreService');
let FirebaseFirestoreService = FirebaseFirestoreService_1 = class FirebaseFirestoreService {
    constructor(firebaseRepository) {
        this.firebaseRepository = firebaseRepository;
        this.appLogger = new app_logger_service_1.AppLogger(FirebaseFirestoreService_1.name);
    }
    async getCollection(collectionName) {
        return await this.firebaseRepository.getCollection(collectionName);
    }
};
exports.FirebaseFirestoreService = FirebaseFirestoreService;
exports.FirebaseFirestoreService = FirebaseFirestoreService = FirebaseFirestoreService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(firebase_repository_1.IFirebaseRepository)),
    __metadata("design:paramtypes", [Object])
], FirebaseFirestoreService);
//# sourceMappingURL=firebase.firestore.service.js.map