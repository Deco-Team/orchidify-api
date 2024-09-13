import { Test, TestingModule } from '@nestjs/testing'
import { FilterQuery, UpdateQuery, Types } from 'mongoose'
import { UserRole } from '@common/contracts/constant'
import { CreateUserTokenDto } from '@auth/dto/user-token.dto'
import { UserToken } from '@auth/schemas/user-token.schema'
import { UserTokenService } from '@auth/services/user-token.service'
import { IUserTokenRepository } from '@auth/repositories/user-token.repository'

// Mock IUserTokenRepository interface
interface MockIUserTokenRepository {
  create(createUserTokenDto: CreateUserTokenDto, options?: any): Promise<UserToken>
  findOneAndUpdate(conditions: FilterQuery<any>, payload: UpdateQuery<any>, options?: any): Promise<UserToken>
  findOne(conditions: FilterQuery<any>): Promise<UserToken>
  deleteMany(conditions: FilterQuery<any>): Promise<any>
}

describe('UserTokenService', () => {
  let userTokenService: UserTokenService
  let userTokenRepository: MockIUserTokenRepository
  const mockUserToken = {
    _id: '_id',
    userId: new Types.ObjectId(),
    role: UserRole.LEARNER,
    refreshToken: 'refreshToken',
    enabled: true
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTokenService,
        {
          provide: IUserTokenRepository,
          useFactory: () => ({
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOne: jest.fn(),
            deleteMany: jest.fn()
          })
        }
      ]
    }).compile()

    userTokenService = module.get<UserTokenService>(UserTokenService)
    userTokenRepository = module.get<MockIUserTokenRepository>(IUserTokenRepository)
  })

  it('should create a user token', async () => {
    const createUserTokenDto: CreateUserTokenDto = {
      userId: new Types.ObjectId(),
      role: UserRole.LEARNER,
      refreshToken: 'refreshToken'
    }
    const expectedUserToken: UserToken = mockUserToken

    jest.spyOn(userTokenRepository, 'create').mockResolvedValue(expectedUserToken)

    const result = await userTokenService.create(createUserTokenDto)

    expect(result).toEqual(expectedUserToken)
    expect(userTokenRepository.create).toHaveBeenCalled()
  })

  it('should update a user token', async () => {
    const conditions: FilterQuery<any> = {
      userId: new Types.ObjectId(),
      role: UserRole.LEARNER
    }
    const payload: UpdateQuery<any> = {
      refreshToken: 'newRefreshToken'
    }
    const expectedUserToken = {
      ...mockUserToken,
      refreshToken: 'newRefreshToken'
    } as UserToken

    jest.spyOn(userTokenRepository, 'findOneAndUpdate').mockResolvedValue(expectedUserToken)

    const result = await userTokenService.update(conditions, payload)

    expect(result).toEqual(expectedUserToken)
    expect(userTokenRepository.findOneAndUpdate).toHaveBeenCalled()
  })

  it('should find a user token by refresh token', async () => {
    const refreshToken = 'refresh_token_123'
    const expectedUserToken: UserToken = {
      ...mockUserToken,
      refreshToken
    }

    jest.spyOn(userTokenRepository, 'findOne').mockResolvedValue(expectedUserToken)

    const result = await userTokenService.findByRefreshToken(refreshToken)

    expect(result).toEqual(expectedUserToken)
    expect(userTokenRepository.findOne).toHaveBeenCalled()
  })

  it('should disable a user token by refresh token', async () => {
    const refreshToken = 'refresh_token_123'
    const expectedUserToken: UserToken = {
      ...mockUserToken,
      refreshToken
    }

    jest.spyOn(userTokenRepository, 'findOneAndUpdate').mockResolvedValue(expectedUserToken)

    const result = await userTokenService.disableRefreshToken(refreshToken)

    expect(result).toEqual(expectedUserToken)
    expect(userTokenRepository.findOneAndUpdate).toHaveBeenCalled()
  })

  it('should clear all refresh tokens of a user', async () => {
    jest.spyOn(userTokenRepository, 'deleteMany').mockResolvedValue({ acknowledged: true })

    await userTokenService.clearAllRefreshTokensOfUser(mockUserToken.userId, mockUserToken.role)

    expect(userTokenRepository.deleteMany).toHaveBeenCalled()
  })
})
