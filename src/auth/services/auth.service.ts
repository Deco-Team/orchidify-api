import { JwtService } from '@nestjs/jwt'
import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { Errors } from '@common/contracts/error'
import { UserRole, LearnerStatus, InstructorStatus, StaffStatus, GardenManagerStatus } from '@common/contracts/constant'
import * as bcrypt from 'bcrypt'
import { AccessTokenPayload } from '@auth/strategies/jwt-access.strategy'
import { RefreshTokenPayload } from '@auth/strategies/jwt-refresh.strategy'
import { RefreshTokenDto, TokenDataResponse } from '@auth/dto/token.dto'
import { ConfigService } from '@nestjs/config'
import { SuccessResponse } from '@common/contracts/dto'
import { ILearnerService } from '@learner/services/learner.service'
import { AppException } from '@common/exceptions/app.exception'
import { LoginDto } from '@auth/dto/login.dto'
import { IInstructorService } from '@instructor/services/instructor.service'
import { IStaffService } from '@staff/services/staff.service'
import { IGardenManagerService } from '@garden-manager/services/garden-manager.service'
import { IUserTokenService } from './user-token.service'

export interface IAuthUserService {
  findByEmail(email: string, projection?: string | Record<string, any>)
  findById(id: string): Promise<any>
}

export const IAuthService = Symbol('IAuthService')

export interface IAuthService {
  login(loginDto: LoginDto, role: UserRole): Promise<TokenDataResponse>
  logout(refreshTokenDto: RefreshTokenDto): Promise<SuccessResponse>
  refreshToken(id: string, role: UserRole, refreshToken: string): Promise<TokenDataResponse>
  // register(registerReqDto: LearnerRegisterDto): Promise<SuccessResponse>
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(ILearnerService)
    private readonly learnerService: ILearnerService,
    @Inject(IInstructorService)
    private readonly instructorService: IInstructorService,
    @Inject(IStaffService)
    private readonly staffService: IStaffService,
    @Inject(IGardenManagerService)
    private readonly gardenManagerService: IGardenManagerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(IUserTokenService)
    private readonly userTokenService: IUserTokenService
  ) {}

  private readonly authUserServiceMap: Record<UserRole, IAuthUserService> = {
    [UserRole.LEARNER]: this.learnerService,
    [UserRole.INSTRUCTOR]: this.instructorService,
    [UserRole.STAFF]: this.staffService,
    [UserRole.ADMIN]: this.staffService,
    [UserRole.GARDEN_MANAGER]: this.gardenManagerService
  }

  public async login(loginDto: LoginDto, role: UserRole): Promise<TokenDataResponse> {
    const user = await this.authUserServiceMap[role].findByEmail(loginDto.email, '+password')
    if (!user) throw new AppException(Errors.WRONG_EMAIL_OR_PASSWORD)
    if (user.status === LearnerStatus.UNVERIFIED) throw new AppException(Errors.UNVERIFIED_ACCOUNT)
    if (
      [LearnerStatus.INACTIVE, InstructorStatus.INACTIVE, StaffStatus.INACTIVE, GardenManagerStatus.INACTIVE].includes(
        user.status
      )
    )
      throw new AppException(Errors.INACTIVE_ACCOUNT)

    const isPasswordMatch = await this.comparePassword(loginDto.password, user.password)
    if (!isPasswordMatch) throw new BadRequestException(Errors.WRONG_EMAIL_OR_PASSWORD.message)

    const userRole = user.role ?? role
    const accessTokenPayload: AccessTokenPayload = { sub: user._id, role: userRole, name: user.name }
    const refreshTokenPayload: RefreshTokenPayload = { sub: user._id, role: userRole }

    const tokens = this.generateTokens(accessTokenPayload, refreshTokenPayload)

    await this.userTokenService.create({ userId: user._id, role: userRole, refreshToken: tokens.refreshToken })
    return tokens
  }

  async logout(refreshTokenDto: RefreshTokenDto) {
    await this.userTokenService.disableRefreshToken(refreshTokenDto.refreshToken)
    return new SuccessResponse(true)
  }

  public async refreshToken(id: string, role: UserRole, refreshToken: string): Promise<TokenDataResponse> {
    const userToken = await this.userTokenService.findByRefreshToken(refreshToken)
    if (!userToken || userToken.enabled === false) throw new AppException(Errors.REFRESH_TOKEN_INVALID)

    const user = await this.authUserServiceMap[role].findById(id)
    if (!user) throw new AppException(Errors.REFRESH_TOKEN_INVALID)

    const accessTokenPayload: AccessTokenPayload = { sub: user._id, role, name: user.name }
    const refreshTokenPayload: RefreshTokenPayload = { sub: user._id, role }
    const tokens = this.generateTokens(accessTokenPayload, refreshTokenPayload)

    await this.userTokenService.update({ _id: userToken._id }, { refreshToken: tokens.refreshToken })
    return tokens
  }

  // public async register(learnerRegisterDto: LearnerRegisterDto) {
  //   const learner = await this.learnerService.findByEmail(learnerRegisterDto.email)
  //   if (learner) throw new BadRequestException(Errors.EMAIL_ALREADY_EXIST.message)

  //   const password = await this.hashPassword(learnerRegisterDto.password)

  //   await this.learnerService.create({
  //     name: learnerRegisterDto.name,
  //     email: learnerRegisterDto.email,
  //     dateOfBirth: learnerRegisterDto.dateOfBirth,
  //     phone: learnerRegisterDto.phone,
  //     password
  //   })

  //   return new SuccessResponse(true)
  // }

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
