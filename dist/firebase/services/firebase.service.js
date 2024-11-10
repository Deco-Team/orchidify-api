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
var FirebaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = exports.IFirebaseService = void 0;
const common_1 = require("@nestjs/common");
const firebase_repository_1 = require("../repositories/firebase.repository");
const app_logger_service_1 = require("../../common/services/app-logger.service");
const instructor_service_1 = require("../../instructor/services/instructor.service");
const learner_service_1 = require("../../learner/services/learner.service");
const constant_1 = require("../../common/contracts/constant");
exports.IFirebaseService = Symbol('IFirebaseService');
let FirebaseService = FirebaseService_1 = class FirebaseService {
    constructor(firebaseRepository, instructorService, learnerService) {
        this.firebaseRepository = firebaseRepository;
        this.instructorService = instructorService;
        this.learnerService = learnerService;
        this.appLogger = new app_logger_service_1.AppLogger(FirebaseService_1.name);
    }
    async createCustomToken(userAuth) {
        const { _id, role } = userAuth;
        try {
            await this.firebaseRepository.getAuth().getUser(_id);
        }
        catch (error) {
            this.appLogger.error(error.name);
            if (role === constant_1.UserRole.INSTRUCTOR) {
                const instructor = await this.instructorService.findById(_id);
                await this.firebaseRepository.getAuth().createUser({
                    uid: _id,
                    displayName: instructor.name,
                    email: instructor.email,
                    photoURL: instructor.avatar
                });
            }
            else if (role === constant_1.UserRole.LEARNER) {
                const learner = await this.learnerService.findById(_id);
                await this.firebaseRepository.getAuth().createUser({
                    uid: _id,
                    displayName: learner.name,
                    email: learner.email,
                    photoURL: learner.avatar
                });
            }
        }
        return await this.firebaseRepository.getAuth().createCustomToken(_id);
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = FirebaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(firebase_repository_1.IFirebaseRepository)),
    __param(1, (0, common_1.Inject)(instructor_service_1.IInstructorService)),
    __param(2, (0, common_1.Inject)(learner_service_1.ILearnerService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map