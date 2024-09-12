import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from '@auth/services/auth.service'
import { ILearnerService } from '@learner/services/learner.service'
import { IInstructorService } from '@instructor/services/instructor.service'
import { IStaffService } from '@staff/services/staff.service'
import { IGardenManagerService } from '@garden-manager/services/garden-manager.service'
import { IUserTokenService } from '@auth/services/user-token.service'
import { IOtpService } from '@auth/services/otp.service'
import { IRecruitmentService } from '@recruitment/services/recruitment.service'
import { JwtService } from '@nestjs/jwt'
import { HelperService } from '@common/services/helper.service'
import { ConfigService } from '@nestjs/config'
import { NotificationAdapter } from '@common/adapters/notification.adapter'
import { Errors } from '@common/contracts/error'
import { AppException } from '@common/exceptions/app.exception'
import { BadRequestException } from '@nestjs/common'
import { SuccessResponse } from '@common/contracts/dto'
import { LoginDto } from '@auth/dto/login.dto'
import { LearnerStatus, RecruitmentStatus, UserRole } from '@common/contracts/constant'
import { Types } from 'mongoose'
import { LearnerRegisterDto, LearnerResendOtpDto, LearnerVerifyAccountDto } from '@auth/dto/learner-register.dto'
import { InstructorRegisterDto } from '@auth/dto/instructor-register.dto'
import { LearnerDocument } from '@learner/schemas/learner.schema'
import { RefreshTokenDto } from '@auth/dto/token.dto'
import { UserToken } from '@auth/schemas/user-token.schema'
import { OtpDocument } from '@auth/schemas/otp.schema'
import { InstructorDocument } from '@instructor/schemas/instructor.schema'
import { RecruitmentDocument } from '@recruitment/schemas/recruitment.schema'

describe('AuthService', () => {
  let authService: AuthService
  let learnerServiceMock: ILearnerService
  let instructorServiceMock: IInstructorService
  let staffServiceMock: IStaffService
  let gardenManagerServiceMock: IGardenManagerService
  let userTokenServiceMock: IUserTokenService
  let otpServiceMock: IOtpService
  let recruitmentServiceMock: IRecruitmentService
  let jwtServiceMock: JwtService
  let helperServiceMock: HelperService
  let configServiceMock: ConfigService
  let notificationAdapterMock: NotificationAdapter

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ILearnerService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn()
          }
        },
        {
          provide: IInstructorService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn()
          }
        },
        { provide: IStaffService, useClass: jest.fn() },
        { provide: IGardenManagerService, useClass: jest.fn() },
        {
          provide: IUserTokenService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findByRefreshToken: jest.fn(),
            disableRefreshToken: jest.fn()
          }
        },
        {
          provide: IOtpService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findByCode: jest.fn(),
            findByUserIdAndRole: jest.fn(),
            clearOtp: jest.fn()
          }
        },
        {
          provide: IRecruitmentService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findByApplicationEmailAndStatus: jest.fn()
          }
        },
        { provide: JwtService, useValue: { sign: jest.fn() } },
        {
          provide: HelperService,
          useValue: {
            comparePassword: jest.fn(),
            hashPassword: jest.fn(),
            generateRandomString: jest.fn()
          }
        },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: NotificationAdapter, useValue: { sendMail: jest.fn() } }
      ]
    }).compile()

    authService = module.get<AuthService>(AuthService)
    learnerServiceMock = module.get<ILearnerService>(ILearnerService)
    instructorServiceMock = module.get<IInstructorService>(IInstructorService)
    staffServiceMock = module.get<IStaffService>(IStaffService)
    gardenManagerServiceMock = module.get<IGardenManagerService>(IGardenManagerService)
    userTokenServiceMock = module.get<IUserTokenService>(IUserTokenService)
    otpServiceMock = module.get<IOtpService>(IOtpService)
    recruitmentServiceMock = module.get<IRecruitmentService>(IRecruitmentService)
    jwtServiceMock = module.get<JwtService>(JwtService)
    helperServiceMock = module.get<HelperService>(HelperService)
    configServiceMock = module.get<ConfigService>(ConfigService)
    notificationAdapterMock = module.get<NotificationAdapter>(NotificationAdapter)
  })

  describe('login', () => {
    it('should return a token pair when the credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'valid@email.com',
        password: 'correctPassword'
      }
      const role = UserRole.LEARNER

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue({
        _id: '_id',
        email: 'valid@email.com',
        password: 'correctPassword',
        status: LearnerStatus.ACTIVE
      } as LearnerDocument)

      jest.spyOn(helperServiceMock, 'comparePassword').mockResolvedValue(true)

      const result = await authService.login(loginDto, role)

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
    })

    it('should throw an error when the email or password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'invalid@email.com',
        password: 'incorrectPassword'
      }
      const role = UserRole.LEARNER

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue(null)

      await expect(authService.login(loginDto, role)).rejects.toThrow(new AppException(Errors.WRONG_EMAIL_OR_PASSWORD))
    })

    it('should throw an error when the user account is unverified', async () => {
      const loginDto: LoginDto = {
        email: 'unverified@email.com',
        password: 'correctPassword'
      }
      const role = UserRole.LEARNER

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue({
        _id: '_id',
        email: 'unverified@email.com',
        password: 'correctPassword',
        status: LearnerStatus.UNVERIFIED
      } as LearnerDocument)

      await expect(authService.login(loginDto, role)).rejects.toThrow(new AppException(Errors.UNVERIFIED_ACCOUNT))
    })

    it('should throw an error when the user account is inactive', async () => {
      const loginDto: LoginDto = {
        email: 'inactive@email.com',
        password: 'correctPassword'
      }
      const role = UserRole.LEARNER

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue({
        _id: '_id',
        email: 'inactive@email.com',
        password: 'correctPassword',
        status: LearnerStatus.INACTIVE
      } as LearnerDocument)

      await expect(authService.login(loginDto, role)).rejects.toThrow(new AppException(Errors.INACTIVE_ACCOUNT))
    })

    it('should throw an error when the password does not match', async () => {
      const loginDto: LoginDto = {
        email: 'correct@email.com',
        password: 'incorrectPassword'
      }
      const role = UserRole.LEARNER

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue({
        _id: '_id',
        email: 'correct@email.com',
        password: 'correctPassword'
      } as LearnerDocument)

      jest.spyOn(helperServiceMock, 'comparePassword').mockResolvedValue(false)

      await expect(authService.login(loginDto, role)).rejects.toThrow(new AppException(Errors.WRONG_EMAIL_OR_PASSWORD))
    })
  })

  describe('logout', () => {
    it('should return a success response when the refresh token is valid', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'valid-refresh-token'
      }

      jest.spyOn(userTokenServiceMock, 'disableRefreshToken').mockResolvedValue({} as UserToken)

      const result = await authService.logout(refreshTokenDto)

      expect(result).toEqual(new SuccessResponse(true))
    })
  })

  describe('refreshToken', () => {
    it('should return a new token pair when the refresh token is valid', async () => {
      const userId = new Types.ObjectId()
      const role = UserRole.LEARNER
      const refreshToken = 'valid-refresh-token'

      jest.spyOn(userTokenServiceMock, 'findByRefreshToken').mockResolvedValue({
        _id: '_id',
        userId,
        role,
        refreshToken,
        enabled: true
      })

      jest.spyOn(learnerServiceMock, 'findById').mockResolvedValue({
        _id: userId.toString(),
        name: 'John Doe'
      } as LearnerDocument)

      jest.spyOn(jwtServiceMock, 'sign').mockReturnValueOnce('new-access-token')
      jest.spyOn(jwtServiceMock, 'sign').mockReturnValueOnce('new-refresh-token')

      const result = await authService.refreshToken(userId.toString(), role, refreshToken)

      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      })

      expect(userTokenServiceMock.update).toHaveBeenCalled()
    })

    it('should throw an error when the refresh token is invalid', async () => {
      const userId = new Types.ObjectId()
      const role = UserRole.LEARNER
      const refreshToken = 'invalid-refresh-token'

      jest.spyOn(userTokenServiceMock, 'findByRefreshToken').mockResolvedValue(null)

      await expect(authService.refreshToken(userId.toString(), role, refreshToken)).rejects.toThrow(
        new AppException(Errors.REFRESH_TOKEN_INVALID)
      )
    })

    it('should throw an error when the user does not exist', async () => {
      const userId = new Types.ObjectId()
      const role = UserRole.LEARNER
      const refreshToken = 'valid-refresh-token'

      jest.spyOn(userTokenServiceMock, 'findByRefreshToken').mockResolvedValue({
        _id: '_id',
        userId,
        role,
        refreshToken,
        enabled: true
      })

      jest.spyOn(learnerServiceMock, 'findById').mockResolvedValue(null)

      await expect(authService.refreshToken(userId.toString(), role, refreshToken)).rejects.toThrow(
        new AppException(Errors.REFRESH_TOKEN_INVALID)
      )
    })
  })

  describe('registerByLearner', () => {
    it('should throw an error when the email already exists', async () => {
      const learnerRegisterDto: LearnerRegisterDto = {
        name: 'John Doe',
        email: 'existing@email.com',
        dateOfBirth: new Date(),
        phone: '1234567890',
        password: 'password'
      }

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue({
        _id: '_id',
        email: 'existing@email.com'
      } as LearnerDocument)

      await expect(authService.registerByLearner(learnerRegisterDto)).rejects.toThrow(
        new AppException(Errors.EMAIL_ALREADY_EXIST)
      )
    })

    it('should throw an error when OTP creation fails', async () => {
      const learnerRegisterDto: LearnerRegisterDto = {
        name: 'John Doe',
        email: 'valid@email.com',
        dateOfBirth: new Date(),
        phone: '1234567890',
        password: 'password'
      }

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue(null)
      jest.spyOn(helperServiceMock, 'hashPassword').mockResolvedValue('hashedPassword')
      jest.spyOn(helperServiceMock, 'generateRandomString').mockResolvedValue('randomString' as never)
      jest.spyOn(learnerServiceMock, 'create').mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'valid@email.com'
      } as LearnerDocument)
      jest.spyOn(otpServiceMock, 'create').mockRejectedValue(new Error('OTP creation failed'))

      await expect(authService.registerByLearner(learnerRegisterDto)).rejects.toThrow('OTP creation failed')
    })

    it('should return a success response when registration is successful', async () => {
      const learnerRegisterDto: LearnerRegisterDto = {
        name: 'John Doe',
        email: 'valid@email.com',
        dateOfBirth: new Date(),
        phone: '1234567890',
        password: 'password'
      }

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue(null)
      jest.spyOn(helperServiceMock, 'hashPassword').mockResolvedValue('hashedPassword')
      jest.spyOn(learnerServiceMock, 'create').mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'valid@email.com'
      } as LearnerDocument)
      jest.spyOn(otpServiceMock, 'create').mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        code: '123456'
      } as OtpDocument)

      const result = await authService.registerByLearner(learnerRegisterDto)

      expect(result).toEqual(new SuccessResponse(true))
    })
  })

  describe('verifyOtpByLearner', () => {
    it('should throw an error when the learner is not found', async () => {
      const learnerVerifyAccountDto: LearnerVerifyAccountDto = {
        email: 'nonexistent@email.com',
        code: '123456'
      }

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue(null)

      await expect(authService.verifyOtpByLearner(learnerVerifyAccountDto)).rejects.toThrow(
        new AppException(Errors.LEARNER_NOT_FOUND)
      )
    })

    it('should throw an error when the learner account is inactive', async () => {
      const learnerVerifyAccountDto: LearnerVerifyAccountDto = {
        email: 'inactive@email.com',
        code: '123456'
      }

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'inactive@email.com',
        status: LearnerStatus.INACTIVE
      } as LearnerDocument)

      await expect(authService.verifyOtpByLearner(learnerVerifyAccountDto)).rejects.toThrow(
        new AppException(Errors.INACTIVE_ACCOUNT)
      )
    })

    it('should throw an error when the OTP is not found or invalid', async () => {
      const learnerVerifyAccountDto: LearnerVerifyAccountDto = {
        email: 'valid@email.com',
        code: 'invalid-code'
      }

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'valid@email.com',
        status: LearnerStatus.UNVERIFIED
      } as LearnerDocument)
      jest.spyOn(otpServiceMock, 'findByCode').mockResolvedValue(null)

      await expect(authService.verifyOtpByLearner(learnerVerifyAccountDto)).rejects.toThrow(
        new AppException(Errors.WRONG_OTP_CODE)
      )
    })

    it('should throw an error when the OTP is expired', async () => {
      const learnerVerifyAccountDto: LearnerVerifyAccountDto = {
        email: 'valid@email.com',
        code: '123456'
      }

      const userId = new Types.ObjectId()
      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue({
        _id: userId.toString(),
        email: 'valid@email.com',
        status: LearnerStatus.UNVERIFIED
      } as LearnerDocument)
      jest.spyOn(otpServiceMock, 'findByCode').mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        userId,
        role: UserRole.LEARNER,
        code: '123456',
        expiredAt: new Date(Date.now() - 10000) // 10 seconds ago
      } as OtpDocument)

      await expect(authService.verifyOtpByLearner(learnerVerifyAccountDto)).rejects.toThrow(
        new AppException(Errors.OTP_CODE_IS_EXPIRED)
      )
    })

    it('should return a success response when the OTP is valid', async () => {
      const learnerVerifyAccountDto: LearnerVerifyAccountDto = {
        email: 'valid@email.com',
        code: '123456'
      }

      const userId = new Types.ObjectId()
      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue({
        _id: userId.toString(),
        email: 'valid@email.com',
        status: LearnerStatus.UNVERIFIED
      } as LearnerDocument)
      jest.spyOn(otpServiceMock, 'findByCode').mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        userId,
        role: UserRole.LEARNER,
        code: '123456',
        expiredAt: new Date(Date.now() + 10000) // 10 seconds later
      } as OtpDocument)

      const result = await authService.verifyOtpByLearner(learnerVerifyAccountDto)

      expect(result).toEqual(new SuccessResponse(true))
    })
  })

  describe('resendOtpByLearner', () => {
    it('should throw an error when the learner is not found', async () => {
      const learnerResendOtpDto: LearnerResendOtpDto = {
        email: 'nonexistent@email.com'
      }

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue(null)

      await expect(authService.resendOtpByLearner(learnerResendOtpDto)).rejects.toThrow(
        new AppException(Errors.LEARNER_NOT_FOUND)
      )
    })

    it('should throw an error when the learner account is inactive', async () => {
      const learnerResendOtpDto: LearnerResendOtpDto = {
        email: 'inactive@email.com'
      }

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'inactive@email.com',
        status: LearnerStatus.INACTIVE
      } as LearnerDocument)

      await expect(authService.resendOtpByLearner(learnerResendOtpDto)).rejects.toThrow(
        new AppException(Errors.INACTIVE_ACCOUNT)
      )
    })

    it('should throw an error when the OTP resend limit is reached', async () => {
      const learnerResendOtpDto: LearnerResendOtpDto = {
        email: 'valid@email.com'
      }

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'valid@email.com',
        status: LearnerStatus.UNVERIFIED
      } as LearnerDocument)
      jest.spyOn(otpServiceMock, 'findByUserIdAndRole').mockResolvedValue({
        __v: 5
        // updatedAt: new Date(Date.now() - 10000) // 10 seconds ago
      } as OtpDocument)

      await expect(authService.resendOtpByLearner(learnerResendOtpDto)).rejects.toThrow(
        new AppException(Errors.RESEND_OTP_CODE_LIMITED)
      )
    })

    it('should return a success response when the OTP is resent successfully', async () => {
      const learnerResendOtpDto: LearnerResendOtpDto = {
        email: 'valid@email.com'
      }

      jest.spyOn(learnerServiceMock, 'findByEmail').mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'valid@email.com',
        status: LearnerStatus.UNVERIFIED
      } as LearnerDocument)
      jest.spyOn(otpServiceMock, 'findByUserIdAndRole').mockResolvedValue({
        __v: 4,
        save: () => {}
        // updatedAt: new Date(Date.now() - 10000) // 10 seconds ago
      } as OtpDocument)

      const result = await authService.resendOtpByLearner(learnerResendOtpDto)

      expect(result).toEqual(new SuccessResponse(true))
    })
  })

  describe('registerByInstructor', () => {
    it('should throw an error when the email already exists', async () => {
      const instructorRegisterDto: InstructorRegisterDto = {
        name: 'John Doe',
        email: 'existing@email.com',
        phone: '1234567890',
        cv: 'cv',
        note: 'note'
      }

      jest.spyOn(instructorServiceMock, 'findByEmail').mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        email: 'existing@email.com'
      } as InstructorDocument)

      await expect(authService.registerByInstructor(instructorRegisterDto)).rejects.toThrow(
        new AppException(Errors.EMAIL_ALREADY_EXIST)
      )
    })

    it('should throw an error when the instructor has in-progressing applications', async () => {
      const instructorRegisterDto: InstructorRegisterDto = {
        name: 'John Doe',
        email: 'valid@email.com',
        phone: '1234567890',
        cv: 'cv',
        note: 'note'
      }

      jest.spyOn(instructorServiceMock, 'findByEmail').mockResolvedValue(null)
      jest.spyOn(recruitmentServiceMock, 'findByApplicationEmailAndStatus').mockResolvedValue([
        {
          _id: new Types.ObjectId().toString(),
          applicationInfo: instructorRegisterDto,
          status: RecruitmentStatus.PENDING
        } as RecruitmentDocument
      ])

      await expect(authService.registerByInstructor(instructorRegisterDto)).rejects.toThrow(
        new AppException(Errors.INSTRUCTOR_HAS_IN_PROGRESSING_APPLICATIONS)
      )
    })

    it('should throw an error when recruitment creation fails', async () => {
      const instructorRegisterDto: InstructorRegisterDto = {
        name: 'John Doe',
        email: 'valid@email.com',
        phone: '1234567890',
        cv: 'cv',
        note: 'note'
      }

      jest.spyOn(instructorServiceMock, 'findByEmail').mockResolvedValue(null)
      jest.spyOn(recruitmentServiceMock, 'findByApplicationEmailAndStatus').mockResolvedValue([])
      jest.spyOn(recruitmentServiceMock, 'create').mockRejectedValue(new Error('Recruitment creation failed'))

      await expect(authService.registerByInstructor(instructorRegisterDto)).rejects.toThrow(
        'Recruitment creation failed'
      )
    })

    it('should return a success response when registration is successful', async () => {
      const instructorRegisterDto: InstructorRegisterDto = {
        name: 'John Doe',
        email: 'valid@email.com',
        phone: '1234567890',
        cv: 'cv',
        note: 'note'
      }

      jest.spyOn(instructorServiceMock, 'findByEmail').mockResolvedValue(null)
      jest.spyOn(recruitmentServiceMock, 'findByApplicationEmailAndStatus').mockResolvedValue([])
      jest.spyOn(recruitmentServiceMock, 'create').mockResolvedValue({
        _id: new Types.ObjectId().toString(),
        applicationInfo: instructorRegisterDto,
        status: RecruitmentStatus.PENDING
      } as RecruitmentDocument)

      const result = await authService.registerByInstructor(instructorRegisterDto)

      expect(result).toEqual(new SuccessResponse(true))
    })
  })
})
