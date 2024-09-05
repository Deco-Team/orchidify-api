import { Global, Module } from '@nestjs/common'
import { JwtAccessStrategy } from '@auth/strategies/jwt-access.strategy'
import { PassportModule } from '@nestjs/passport'
import { LearnerModule } from '@src/learner/learner.module'
import { LearnerAuthController } from '@auth/controllers/learner.auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { JwtRefreshStrategy } from '@auth/strategies/jwt-refresh.strategy'
import { AuthService, IAuthService } from './services/auth.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserToken, UserTokenSchema } from './schemas/user-token.schema'
import { InstructorModule } from '@instructor/instructor.module'
import { StaffModule } from '@staff/staff.module'
import { GardenManagerModule } from '@garden-manager/garden-manager.module'
import { InstructorAuthController } from './controllers/instructor.auth.controller'
import { ManagementAuthController } from './controllers/management.auth.controller'
import { IUserTokenRepository, UserTokenRepository } from './repositories/user-token.repository'
import { IUserTokenService, UserTokenService } from './services/user-token.service'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserToken.name, schema: UserTokenSchema }]),
    ConfigModule,
    LearnerModule,
    InstructorModule,
    StaffModule,
    GardenManagerModule,
    PassportModule,
    JwtModule
  ],
  controllers: [LearnerAuthController, InstructorAuthController, ManagementAuthController],
  providers: [
    {
      provide: IAuthService,
      useClass: AuthService
    },
    {
      provide: IUserTokenService,
      useClass: UserTokenService
    },
    {
      provide: IUserTokenRepository,
      useClass: UserTokenRepository
    },
    JwtAccessStrategy,
    JwtRefreshStrategy
  ],
  exports: [
    {
      provide: IAuthService,
      useClass: AuthService
    }
  ]
})
export class AuthModule {}
