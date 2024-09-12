import { Test, TestingModule } from '@nestjs/testing'
import { Types } from 'mongoose'
import { IOtpRepository } from '@auth/repositories/otp.repository'
import { OtpDocument } from '@auth/schemas/otp.schema'
import { OtpService } from '@auth/services/otp.service'
import { UserRole } from '@common/contracts/constant'

describe('OtpService', () => {
  let otpService: OtpService
  let otpRepository: IOtpRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        {
          provide: IOtpRepository,
          useValue: {
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOne: jest.fn(),
            model: {
              deleteOne: jest.fn()
            }
          }
        }
      ]
    }).compile()

    otpService = module.get<OtpService>(OtpService)
    otpRepository = module.get<IOtpRepository>(IOtpRepository)
  })

  it('should create an OTP document', async () => {
    const createOtpDto = { userId: new Types.ObjectId(), role: UserRole.LEARNER, code: '123456', expiredAt: new Date() } // Create a sample DTO
    const expectedOtp = {
      _id: '_id',
      userId: new Types.ObjectId(),
      role: UserRole.LEARNER,
      code: '123456',
      expiredAt: new Date()
    } as OtpDocument // Expected OTP document

    jest.spyOn(otpRepository, 'create').mockResolvedValueOnce(expectedOtp)

    const result = await otpService.create(createOtpDto)

    expect(result).toEqual(expectedOtp)
    expect(otpRepository.create).toHaveBeenCalled()
  })

  it('should update an OTP document', async () => {
    const conditions = { userId: new Types.ObjectId(), role: UserRole.LEARNER }
    const payload = { code: '123457' }
    const updatedOtp = {
      userId: new Types.ObjectId(),
      role: UserRole.LEARNER,
      code: '123456',
      expiredAt: new Date()
    } as OtpDocument

    jest.spyOn(otpRepository, 'findOneAndUpdate').mockResolvedValueOnce(updatedOtp)

    const result = await otpService.update(conditions, payload, undefined)

    expect(result).toEqual(updatedOtp)
    expect(otpRepository.findOneAndUpdate).toHaveBeenCalled()
  })

  it('should find an OTP by code', async () => {
    const code = '123456'
    const foundOtp = {
      userId: new Types.ObjectId(),
      role: UserRole.LEARNER,
      code: '123456',
      expiredAt: new Date()
    } as OtpDocument

    jest.spyOn(otpRepository, 'findOne').mockResolvedValueOnce(foundOtp)

    const result = await otpService.findByCode(code)

    expect(result).toEqual(foundOtp)
    expect(otpRepository.findOne).toHaveBeenCalledWith({ conditions: { code } })
  })

  it('should find an OTP by userId and role', async () => {
    const userId = 'user123'
    const role = UserRole.ADMIN
    const foundOtp = {
      userId: new Types.ObjectId(),
      role: UserRole.LEARNER,
      code: '123456',
      expiredAt: new Date()
    } as OtpDocument

    jest.spyOn(otpRepository, 'findOne').mockResolvedValueOnce(foundOtp)

    const result = await otpService.findByUserIdAndRole(userId, role)

    expect(result).toEqual(foundOtp)
    expect(otpRepository.findOne).toHaveBeenCalledWith({ conditions: { userId, role } })
  })

  it('should delete an OTP by code', async () => {
    const code = '123456'

    jest.spyOn(otpRepository.model, 'deleteOne').mockResolvedValueOnce({} as any)

    await otpService.clearOtp(code)

    expect(otpRepository.model.deleteOne).toHaveBeenCalledWith({ code })
  })
})
