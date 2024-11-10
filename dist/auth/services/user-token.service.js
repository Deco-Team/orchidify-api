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
exports.UserTokenService = exports.IUserTokenService = void 0;
const common_1 = require("@nestjs/common");
const user_token_repository_1 = require("../repositories/user-token.repository");
exports.IUserTokenService = Symbol('IUserTokenService');
let UserTokenService = class UserTokenService {
    constructor(userTokenRepository) {
        this.userTokenRepository = userTokenRepository;
    }
    create(createUserTokenDto, options) {
        return this.userTokenRepository.create(createUserTokenDto, options);
    }
    update(conditions, payload, options) {
        return this.userTokenRepository.findOneAndUpdate(conditions, payload, options);
    }
    async findByRefreshToken(refreshToken) {
        const userToken = await this.userTokenRepository.findOne({
            conditions: {
                refreshToken,
                enabled: true
            }
        });
        return userToken;
    }
    async disableRefreshToken(refreshToken) {
        const userToken = await this.userTokenRepository.findOneAndUpdate({
            refreshToken
        }, {
            $set: {
                enabled: false
            }
        });
        return userToken;
    }
    async clearAllRefreshTokensOfUser(userId, role) {
        await this.userTokenRepository.deleteMany({
            userId,
            role
        });
    }
};
exports.UserTokenService = UserTokenService;
exports.UserTokenService = UserTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(user_token_repository_1.IUserTokenRepository)),
    __metadata("design:paramtypes", [Object])
], UserTokenService);
//# sourceMappingURL=user-token.service.js.map