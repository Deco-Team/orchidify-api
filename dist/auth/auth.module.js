"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_access_strategy_1 = require("./strategies/jwt-access.strategy");
const passport_1 = require("@nestjs/passport");
const learner_module_1 = require("../learner/learner.module");
const learner_auth_controller_1 = require("./controllers/learner.auth.controller");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_refresh_strategy_1 = require("./strategies/jwt-refresh.strategy");
const auth_service_1 = require("./services/auth.service");
const mongoose_1 = require("@nestjs/mongoose");
const user_token_schema_1 = require("./schemas/user-token.schema");
const instructor_module_1 = require("../instructor/instructor.module");
const staff_module_1 = require("../staff/staff.module");
const garden_manager_module_1 = require("../garden-manager/garden-manager.module");
const instructor_auth_controller_1 = require("./controllers/instructor.auth.controller");
const management_auth_controller_1 = require("./controllers/management.auth.controller");
const user_token_repository_1 = require("./repositories/user-token.repository");
const user_token_service_1 = require("./services/user-token.service");
const otp_schema_1 = require("./schemas/otp.schema");
const otp_repository_1 = require("./repositories/otp.repository");
const otp_service_1 = require("./services/otp.service");
const recruitment_module_1 = require("../recruitment/recruitment.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_token_schema_1.UserToken.name, schema: user_token_schema_1.UserTokenSchema },
                { name: otp_schema_1.Otp.name, schema: otp_schema_1.OtpSchema }
            ]),
            config_1.ConfigModule,
            passport_1.PassportModule,
            jwt_1.JwtModule,
            learner_module_1.LearnerModule,
            instructor_module_1.InstructorModule,
            staff_module_1.StaffModule,
            garden_manager_module_1.GardenManagerModule,
            recruitment_module_1.RecruitmentModule
        ],
        controllers: [learner_auth_controller_1.LearnerAuthController, instructor_auth_controller_1.InstructorAuthController, management_auth_controller_1.ManagementAuthController],
        providers: [
            {
                provide: auth_service_1.IAuthService,
                useClass: auth_service_1.AuthService
            },
            {
                provide: user_token_service_1.IUserTokenService,
                useClass: user_token_service_1.UserTokenService
            },
            {
                provide: user_token_repository_1.IUserTokenRepository,
                useClass: user_token_repository_1.UserTokenRepository
            },
            {
                provide: otp_service_1.IOtpService,
                useClass: otp_service_1.OtpService
            },
            {
                provide: otp_repository_1.IOtpRepository,
                useClass: otp_repository_1.OtpRepository
            },
            jwt_access_strategy_1.JwtAccessStrategy,
            jwt_refresh_strategy_1.JwtRefreshStrategy
        ],
        exports: [
            {
                provide: auth_service_1.IAuthService,
                useClass: auth_service_1.AuthService
            },
            {
                provide: user_token_service_1.IUserTokenService,
                useClass: user_token_service_1.UserTokenService
            }
        ]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map