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
exports.InstructorService = exports.IInstructorService = void 0;
const common_1 = require("@nestjs/common");
const instructor_repository_1 = require("../repositories/instructor.repository");
const constant_1 = require("../contracts/constant");
const constant_2 = require("../../common/contracts/constant");
const helper_service_1 = require("../../common/services/helper.service");
const notification_adapter_1 = require("../../common/adapters/notification.adapter");
exports.IInstructorService = Symbol('IInstructorService');
let InstructorService = class InstructorService {
    constructor(instructorRepository, helperService, notificationAdapter) {
        this.instructorRepository = instructorRepository;
        this.helperService = helperService;
        this.notificationAdapter = notificationAdapter;
    }
    async create(createInstructorDto, options) {
        const password = this.helperService.generateRandomString(10, 'abcdefghijklmnopqrstuvwxyz0123456789');
        const hashPassword = await this.helperService.hashPassword(password);
        createInstructorDto['password'] = hashPassword;
        const instructor = await this.instructorRepository.create(createInstructorDto, options);
        this.notificationAdapter.sendMail({
            to: instructor.email,
            subject: `[Orchidify] Login Information`,
            template: 'instructor/add-instructor',
            context: {
                email: instructor.email,
                name: instructor.name,
                password
            }
        });
        return instructor;
    }
    async findById(instructorId, projection) {
        const instructor = await this.instructorRepository.findOne({
            conditions: {
                _id: instructorId
            },
            projection
        });
        return instructor;
    }
    async findByEmail(email, projection) {
        const instructor = await this.instructorRepository.findOne({
            conditions: {
                email
            },
            projection
        });
        return instructor;
    }
    update(conditions, payload, options) {
        return this.instructorRepository.findOneAndUpdate(conditions, payload, options);
    }
    async list(pagination, queryLearnerDto, projection = constant_1.INSTRUCTOR_LIST_PROJECTION) {
        const { name, email, status } = queryLearnerDto;
        const filter = {};
        const validStatus = status?.filter((status) => [constant_2.InstructorStatus.ACTIVE, constant_2.InstructorStatus.INACTIVE].includes(status));
        if (validStatus?.length > 0) {
            filter['status'] = {
                $in: validStatus
            };
        }
        let textSearch = '';
        if (name)
            textSearch += name.trim();
        if (email)
            textSearch += ' ' + email.trim();
        if (textSearch) {
            filter['$text'] = {
                $search: textSearch.trim()
            };
        }
        return this.instructorRepository.model.paginate(filter, {
            ...pagination,
            projection
        });
    }
};
exports.InstructorService = InstructorService;
exports.InstructorService = InstructorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(instructor_repository_1.IInstructorRepository)),
    __metadata("design:paramtypes", [Object, helper_service_1.HelperService,
        notification_adapter_1.NotificationAdapter])
], InstructorService);
//# sourceMappingURL=instructor.service.js.map