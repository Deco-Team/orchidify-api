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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = exports.ISessionService = void 0;
const common_1 = require("@nestjs/common");
const _ = require("lodash");
const class_repository_1 = require("../repositories/class.repository");
const mongoose_1 = require("mongoose");
const learner_class_service_1 = require("./learner-class.service");
exports.ISessionService = Symbol('ISessionService');
let SessionService = class SessionService {
    constructor(classRepository, learnerClassService) {
        this.classRepository = classRepository;
        this.learnerClassService = learnerClassService;
    }
    async findOneBy(params) {
        const { sessionId, classId, instructorId } = params;
        const conditions = { _id: classId };
        if (instructorId)
            conditions['instructorId'] = new mongoose_1.Types.ObjectId(instructorId);
        const courseClass = await this.classRepository.findOne({
            conditions,
            projection: 'sessions',
            options: { lean: true }
        });
        const sessionIndex = courseClass?.sessions.findIndex((session) => session._id.toString() === sessionId);
        if (sessionIndex === -1)
            return null;
        return courseClass?.sessions[sessionIndex];
    }
    async findMySession(params) {
        const { sessionId, classId, learnerId } = params;
        const conditions = { _id: classId };
        const courseClass = await this.classRepository.findOne({
            conditions,
            projection: 'sessions',
            populates: [
                {
                    path: 'learnerClass',
                    select: ['learnerId']
                }
            ],
            options: { lean: true }
        });
        if (_.get(courseClass, 'learnerClass.learnerId')?.toString() !== learnerId)
            return null;
        const sessionIndex = courseClass?.sessions.findIndex((session) => session._id.toString() === sessionId);
        if (sessionIndex === -1)
            return null;
        return courseClass?.sessions[sessionIndex];
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(class_repository_1.IClassRepository)),
    __param(1, (0, common_1.Inject)(learner_class_service_1.ILearnerClassService)),
    __metadata("design:paramtypes", [Object, Object])
], SessionService);
//# sourceMappingURL=session.service.js.map