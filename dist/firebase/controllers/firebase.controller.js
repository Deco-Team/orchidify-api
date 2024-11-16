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
exports.FirebaseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const dto_1 = require("../../common/contracts/dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const constant_1 = require("../../common/contracts/constant");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const firebase_auth_service_1 = require("../services/firebase.auth.service");
const create_custom_token_firebase_dto_1 = require("../dto/create-custom-token.firebase.dto");
let FirebaseController = class FirebaseController {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async createCustomToken(req) {
        const token = await this.firebaseService.createCustomToken(_.get(req, 'user'));
        return { token };
    }
};
exports.FirebaseController = FirebaseController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.LEARNER}, ${constant_1.UserRole.INSTRUCTOR}] Create Custom Token`
    }),
    (0, swagger_1.ApiOkResponse)({ type: create_custom_token_firebase_dto_1.CreateCustomTokenFirebaseDataResponse }),
    (0, common_1.Post)('custom-token'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "createCustomToken", null);
exports.FirebaseController = FirebaseController = __decorate([
    (0, swagger_1.ApiTags)('Firebase'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.INSTRUCTOR, constant_1.UserRole.LEARNER),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(firebase_auth_service_1.IFirebaseAuthService)),
    __metadata("design:paramtypes", [Object])
], FirebaseController);
//# sourceMappingURL=firebase.controller.js.map