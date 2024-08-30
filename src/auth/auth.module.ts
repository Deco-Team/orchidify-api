import { Global, Module } from '@nestjs/common'
import { JwtAccessStrategy } from '@auth/strategies/jwt-access.strategy'
import { PassportModule } from '@nestjs/passport'
import { LearnerModule } from '@src/learner/learner.module'
import { LearnerAuthController } from '@auth/controllers/learner.auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { JwtRefreshStrategy } from '@auth/strategies/jwt-refresh.strategy'
import { AuthService, IAuthService } from './services/auth.service'

@Global()
@Module({
  imports: [ConfigModule, LearnerModule, PassportModule, JwtModule],
  controllers: [LearnerAuthController],
  providers: [
    {
      provide: IAuthService,
      useClass: AuthService
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
