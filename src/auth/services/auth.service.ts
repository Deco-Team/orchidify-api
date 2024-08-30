import { JwtService } from '@nestjs/jwt'
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { LoginReqDto } from '@auth/dto/login.dto'
import { ILearnerRepository, LearnerRepository } from '@src/learner/repositories/learner.repository'
import { Errors } from '@common/contracts/error'
import { Learner } from '@src/learner/schemas/learner.schema'
import { UserSide, UserRole, LearnerStatus } from '@common/contracts/constant'
import * as bcrypt from 'bcrypt'
import { AccessTokenPayload } from '@auth/strategies/jwt-access.strategy'
import { RefreshTokenPayload } from '@auth/strategies/jwt-refresh.strategy'
import { TokenResDto } from '@auth/dto/token.dto'
import { ConfigService } from '@nestjs/config'
import { RegisterReqDto } from '@auth/dto/register.dto'
import { SuccessResponse } from '@common/contracts/dto'
import { ILearnerService } from '@customer/services/learner.service'
import { AppException } from '@common/exceptions/app.exception'

export const IAuthService = Symbol('IAuthService')

export interface IAuthService {
  login(loginReqDto: LoginReqDto, role: UserRole): Promise<TokenResDto>
  register(registerReqDto: RegisterReqDto): Promise<SuccessResponse>
  refreshToken(id: string, role: UserRole): Promise<TokenResDto>
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(ILearnerService)
    private readonly learnerService: ILearnerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  public async login(loginReqDto: LoginReqDto, role: UserRole): Promise<TokenResDto> {
    let user: Learner
    let userRole: UserRole

    if (role === UserRole.LEARNER) {
      user = await this.learnerService.findByEmail(loginReqDto.email, 'password')
    }

    if (!user) throw new AppException(Errors.WRONG_EMAIL_OR_PASSWORD)
    if (user.status === LearnerStatus.UNVERIFIED) throw new AppException(Errors.UNVERIFIED_ACCOUNT)
    if (user.status === LearnerStatus.INACTIVE) throw new AppException(Errors.INACTIVE_ACCOUNT)

    const isPasswordMatch = await this.comparePassword(loginReqDto.password, user.password)
    if (!isPasswordMatch) throw new BadRequestException(Errors.WRONG_EMAIL_OR_PASSWORD.message)

    const accessTokenPayload: AccessTokenPayload = { name: user.name, sub: user._id, role: userRole }
    const refreshTokenPayload: RefreshTokenPayload = { sub: user._id, role: userRole }

    const tokens = this.generateTokens(accessTokenPayload, refreshTokenPayload)

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }
  }

  public async register(registerReqDto: RegisterReqDto) {
    const customer = await this.learnerService.findByEmail(registerReqDto.email)

    if (customer) throw new BadRequestException(Errors.EMAIL_ALREADY_EXIST.message)

    const password = await this.hashPassword(registerReqDto.password)

    await this.learnerService.create({
      firstName: registerReqDto.firstName,
      lastName: registerReqDto.lastName,
      email: registerReqDto.email,
      password
    })

    return new SuccessResponse(true)
  }

  public async refreshToken(id: string, role: UserRole): Promise<TokenResDto> {
    let tokens: TokenResDto

    if (role === UserRole.LEARNER) {
      const user = await this.learnerService.findById(id)

      if (!user) throw new UnauthorizedException()

      const accessTokenPayload: AccessTokenPayload = { name: user.name, sub: user._id, role: UserRole.LEARNER }

      const refreshTokenPayload: RefreshTokenPayload = { sub: user._id, role: UserRole.LEARNER }

      tokens = this.generateTokens(accessTokenPayload, refreshTokenPayload)
    }

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)
    return hash
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  private generateTokens(accessTokenPayload: AccessTokenPayload, refreshTokenPayload: RefreshTokenPayload) {
    return {
      accessToken: this.jwtService.sign(accessTokenPayload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION')
      }),
      refreshToken: this.jwtService.sign(refreshTokenPayload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION')
      })
    }
  }
}
