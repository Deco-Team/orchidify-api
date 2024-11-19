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
exports.UserDeviceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const dto_1 = require("../../common/contracts/dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const error_1 = require("../../common/contracts/error");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const user_device_service_1 = require("../services/user-device.service");
const user_device_dto_1 = require("../dto/user-device.dto");
const app_exception_1 = require("../../common/exceptions/app.exception");
const mongoose_1 = require("mongoose");
const constant_1 = require("../../common/contracts/constant");
const firebase_messaging_service_1 = require("../../firebase/services/firebase.messaging.service");
let UserDeviceController = class UserDeviceController {
    constructor(userDeviceService, firebaseMessagingService) {
        this.userDeviceService = userDeviceService;
        this.firebaseMessagingService = firebaseMessagingService;
    }
    async get(req, fcmToken) {
        const { _id, role } = _.get(req, 'user');
        const userDevice = await this.userDeviceService.findByFcmToken(fcmToken);
        if (!userDevice || userDevice.userId.toString() !== _id || userDevice.userRole !== role)
            throw new app_exception_1.AppException(error_1.Errors.USER_DEVICE_NOT_FOUND);
        return userDevice;
    }
    async create(req, createUserDeviceDto) {
        const { _id, role } = _.get(req, 'user');
        createUserDeviceDto.userId = new mongoose_1.Types.ObjectId(_id);
        createUserDeviceDto.userRole = role;
        await this.userDeviceService.update({ fcmToken: createUserDeviceDto.fcmToken }, createUserDeviceDto, {
            upsert: true
        });
        this.subscribeFirebaseMessagingTopic({ userId: _id, userRole: role });
        return new dto_1.SuccessResponse(true);
    }
    async subscribeFirebaseMessagingTopic({ userId, userRole }) {
        if (userRole !== constant_1.UserRole.STAFF)
            return;
        const userDevices = await this.userDeviceService.findMany({
            userId: new mongoose_1.Types.ObjectId(userId),
            status: constant_1.UserDeviceStatus.ACTIVE
        });
        if (userDevices.length === 0)
            return;
        const tokens = userDevices.map((userDevice) => userDevice.fcmToken);
        await this.firebaseMessagingService.subscribeToTopic({
            topic: 'STAFF_NOTIFICATION_TOPIC',
            tokens
        });
    }
};
exports.UserDeviceController = UserDeviceController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View User Device Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: user_device_dto_1.UserDeviceDetailDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.USER_DEVICE_NOT_FOUND]),
    (0, common_1.Get)(':fcmToken'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('fcmToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserDeviceController.prototype, "get", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `Create User Device`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([]),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_device_dto_1.CreateUserDeviceDto]),
    __metadata("design:returntype", Promise)
], UserDeviceController.prototype, "create", null);
exports.UserDeviceController = UserDeviceController = __decorate([
    (0, swagger_1.ApiTags)('UserDevice'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('user-devices'),
    __param(0, (0, common_1.Inject)(user_device_service_1.IUserDeviceService)),
    __param(1, (0, common_1.Inject)(firebase_messaging_service_1.IFirebaseMessagingService)),
    __metadata("design:paramtypes", [Object, Object])
], UserDeviceController);
//# sourceMappingURL=user-device.controller.js.map