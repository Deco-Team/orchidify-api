import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import { UserRole, PayoutRequestStatus, InstructorStatus } from '@common/contracts/constant'
import { PayoutRequest } from '@payout-request/schemas/payout-request.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { Setting } from '@setting/schemas/setting.schema'
import { SettingKey } from '@setting/contracts/constant'
import { IPayoutRequestService } from '@payout-request/services/payout-request.service'

describe('InstructorPayoutRequestController (e2e)', () => {
  let payoutRequestModel: Model<PayoutRequest>
  let instructorModel: Model<Instructor>
  let settingModel: Model<Setting>
  let jwtService: JwtService
  let configService: ConfigService
  let payoutRequestService: IPayoutRequestService
  const mockInstructorId = new Types.ObjectId()
  let instructorAccessToken: string

  const testInstructor = {
    _id: mockInstructorId,
    balance: 1000000,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.number({ style: 'international' }),
    avatar: faker.image.avatar(),
    idCardPhoto: faker.image.avatar(),
    dateOfBirth: faker.date.past({ years: 20, refDate: '2000-10-10' }),
    password: faker.internet.password(),
    status: InstructorStatus.ACTIVE
  }

  const testPayoutRequest = {
    _id: new Types.ObjectId(),
    description: faker.lorem.sentence(),
    amount: 500000,
    status: PayoutRequestStatus.PENDING,
    createdBy: mockInstructorId,
    histories: [
      {
        status: PayoutRequestStatus.PENDING,
        timestamp: new Date(),
        userId: mockInstructorId,
        userRole: UserRole.INSTRUCTOR
      }
    ]
  }

  beforeAll(async () => {
    payoutRequestModel = global.rootModule.get(getModelToken(PayoutRequest.name))
    instructorModel = global.rootModule.get(getModelToken(Instructor.name))
    settingModel = global.rootModule.get(getModelToken(Setting.name))
    jwtService = global.rootModule.get(JwtService)
    configService = global.rootModule.get(ConfigService)
    payoutRequestService = global.rootModule.get(IPayoutRequestService)

    instructorAccessToken = jwtService.sign(
      {
        sub: mockInstructorId.toString(),
        role: UserRole.INSTRUCTOR
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    await instructorModel.create(testInstructor)
    await payoutRequestModel.create(testPayoutRequest)
    await settingModel.create([
      {
        key: SettingKey.CreatePayoutRequestLimitPerDay,
        value: '5'
      },
      {
        key: SettingKey.PayoutAmountLimitPerDay,
        value: '50000000'
      }
    ])
  })

  afterAll(async () => {
    await payoutRequestModel.deleteMany({})
    await instructorModel.deleteMany({})
    await settingModel.deleteMany({})
  })

  describe('GET /payout-requests/instructor', () => {
    it('should return payout request list', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/payout-requests/instructor')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
      expect(data.docs[0].createdBy.toString()).toBe(mockInstructorId.toString())
    })
  })

  describe('GET /payout-requests/instructor/:id', () => {
    it('should return payout request detail', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/payout-requests/instructor/${testPayoutRequest._id}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(testPayoutRequest._id.toString())
      expect(data.amount).toBe(testPayoutRequest.amount)
    })

    it('should return 404 when payout request not found', async () => {
      const nonExistentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .get(`/payout-requests/instructor/${nonExistentId}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(404)
    })
  })

  describe('POST /payout-requests/instructor', () => {
    it('should create new payout request', async () => {
      const newPayoutRequest = {
        description: faker.lorem.sentence(10),
        amount: 200000,
        createdBy: mockInstructorId
      }

      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .post('/payout-requests/instructor')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send(newPayoutRequest)
        .expect(201)

      expect(status).toBe(201)
      expect(data._id).toBeDefined()
    })

    it('should return 400 when amount exceeds daily limit', async () => {
      const exceededRequest = {
        description: faker.lorem.sentence(10),
        amount: 50_000_000, // Exceeds 50M limit
        createdBy: mockInstructorId
      }

      jest
      .spyOn(payoutRequestService, 'getPayoutUsage')
      .mockResolvedValue(10_000_000) // Mocking the daily payout limit

      await request(global.app.getHttpServer())
        .post('/payout-requests/instructor')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send(exceededRequest)
        .expect(400)
    })
  })

  describe('PATCH /payout-requests/instructor/:id/cancel', () => {
    it('should cancel payout request', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .patch(`/payout-requests/instructor/${testPayoutRequest._id}/cancel`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.success).toBe(true)

      const updatedRequest = await payoutRequestModel.findById(testPayoutRequest._id)
      expect(updatedRequest.status).toBe(PayoutRequestStatus.CANCELED)
    })
  })

  describe('GET /payout-requests/instructor/usage', () => {
    it('should return payout usage information', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/payout-requests/instructor/usage')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.balance).toBeDefined()
      expect(data.usage).toBeDefined()
      expect(data.count).toBeDefined()
    })
  })
})
