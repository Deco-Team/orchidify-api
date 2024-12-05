import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import { UserRole, PayoutRequestStatus, StaffStatus } from '@common/contracts/constant'
import { PayoutRequest } from '@payout-request/schemas/payout-request.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Staff } from '@staff/schemas/staff.schema'
import { Setting } from '@setting/schemas/setting.schema'
import { SettingKey } from '@setting/contracts/constant'
import { MediaResourceType, MediaType } from '@media/contracts/constant'

describe('ManagementPayoutRequestController (e2e)', () => {
  let payoutRequestModel: Model<PayoutRequest>
  let staffModel: Model<Staff>
  let settingModel: Model<Setting>
  let jwtService: JwtService
  let configService: ConfigService
  const mockStaffId = new Types.ObjectId()
  let staffAccessToken: string

  const testStaff = {
    _id: mockStaffId,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    status: StaffStatus.ACTIVE,
    idCardPhoto: faker.image.avatar(),
    staffCode: faker.number.romanNumeral()
  }

  const testPayoutRequest = {
    _id: new Types.ObjectId(),
    description: faker.lorem.sentence(),
    amount: 500000,
    status: PayoutRequestStatus.PENDING,
    createdBy: new Types.ObjectId(),
    histories: [
      {
        status: PayoutRequestStatus.PENDING,
        timestamp: new Date(),
        userId: new Types.ObjectId(),
        userRole: UserRole.INSTRUCTOR
      }
    ]
  }

  beforeAll(async () => {
    payoutRequestModel = global.rootModule.get(getModelToken(PayoutRequest.name))
    staffModel = global.rootModule.get(getModelToken(Staff.name))
    settingModel = global.rootModule.get(getModelToken(Setting.name))
    jwtService = global.rootModule.get(JwtService)
    configService = global.rootModule.get(ConfigService)

    staffAccessToken = jwtService.sign(
      {
        sub: mockStaffId.toString(),
        role: UserRole.STAFF
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    await staffModel.create(testStaff)
    await payoutRequestModel.create(testPayoutRequest)
    await settingModel.create([
      {
        key: SettingKey.PayoutAmountLimitPerDay,
        value: '50000000'
      }
    ])
  })

  afterAll(async () => {
    await payoutRequestModel.deleteMany({})
    await staffModel.deleteMany({})
    await settingModel.deleteMany({})
  })

  describe('GET /payout-requests/management', () => {
    it('should return payout request list', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/payout-requests/management')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
    })
  })

  describe('GET /payout-requests/management/:id', () => {
    it('should return payout request detail', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/payout-requests/management/${testPayoutRequest._id}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(testPayoutRequest._id.toString())
      expect(data.amount).toBe(testPayoutRequest.amount)
    })

    it('should return 404 when payout request not found', async () => {
      const nonExistentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .get(`/payout-requests/management/${nonExistentId}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })
  })

  describe('PATCH /payout-requests/management/:id/approve', () => {
    it('should approve payout request', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .patch(`/payout-requests/management/${testPayoutRequest._id}/approve`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.success).toBe(true)

      const updatedRequest = await payoutRequestModel.findById(testPayoutRequest._id)
      expect(updatedRequest.status).toBe(PayoutRequestStatus.APPROVED)
    })

    it('should return 404 when payout request not found', async () => {
      const nonExistentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .patch(`/payout-requests/management/${nonExistentId}/approve`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })

    it('should return 400 when payout request status is invalid', async () => {
      const paidRequest = await payoutRequestModel.create({
        ...testPayoutRequest,
        _id: new Types.ObjectId(),
        status: PayoutRequestStatus.APPROVED
      })

      await request(global.app.getHttpServer())
        .patch(`/payout-requests/management/${paidRequest._id}/approve`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(400)
    })
  })

  describe('PATCH /payout-requests/management/:id/reject', () => {
    it('should reject payout request', async () => {
      // update payout request to pending status
      await payoutRequestModel.updateOne(
        { _id: testPayoutRequest._id },
        {
          $set: {
            status: PayoutRequestStatus.PENDING
          }
        }
      )

      const rejectReason = faker.lorem.sentence(10)
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .patch(`/payout-requests/management/${testPayoutRequest._id}/reject`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({ rejectReason })
        .expect(200)

      expect(status).toBe(200)
      expect(data.success).toBe(true)

      const updatedRequest = await payoutRequestModel.findById(testPayoutRequest._id)
      expect(updatedRequest.status).toBe(PayoutRequestStatus.REJECTED)
    })

    it('should return 404 when payout request not found', async () => {
      const nonExistentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .patch(`/payout-requests/management/${nonExistentId}/reject`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({ rejectReason: 'Invalid request' })
        .expect(404)
    })

    it('should return 400 when payout request status is invalid', async () => {
      const canceledRequest = await payoutRequestModel.create({
        ...testPayoutRequest,
        _id: new Types.ObjectId(),
        status: PayoutRequestStatus.CANCELED
      })

      await request(global.app.getHttpServer())
        .patch(`/payout-requests/management/${canceledRequest._id}/reject`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({ rejectReason: 'Cannot reject canceled request' })
        .expect(400)
    })

    it('should return 400 when reject reason is missing', async () => {
      await request(global.app.getHttpServer())
        .patch(`/payout-requests/management/${testPayoutRequest._id}/reject`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({})
        .expect(422)
    })
  })

  describe('PATCH /payout-requests/management/:id/make-payout', () => {
    it('should mark payout request as paid', async () => {
      // update payout request to pending status
      await payoutRequestModel.updateOne(
        { _id: testPayoutRequest._id },
        {
          $set: {
            status: PayoutRequestStatus.APPROVED
          }
        }
      )

      const transactionCode = faker.string.alphanumeric(10)
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .patch(`/payout-requests/management/${testPayoutRequest._id}/make-payout`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({
          transactionCode,
          attachment: {
            asset_id: 'asset_id',
            public_id: 'public_id',
            resource_type: MediaResourceType.auto,
            type: MediaType.upload,
            url: faker.image.url()
          }
        })
        .expect(200)

      expect(status).toBe(200)
      expect(data.success).toBe(true)

      const updatedRequest = await payoutRequestModel.findById(testPayoutRequest._id)
      expect(updatedRequest.status).toBe(PayoutRequestStatus.APPROVED)
      expect(updatedRequest.transactionCode).toBe(transactionCode)
    })

    it('should return 404 when payout request not found', async () => {
      const nonExistentId = new Types.ObjectId()
      const transactionCode = faker.string.alphanumeric(10)
      await request(global.app.getHttpServer())
        .patch(`/payout-requests/management/${nonExistentId}/make-payout`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({
          transactionCode,
          attachment: {
            asset_id: 'asset_id',
            public_id: 'public_id',
            resource_type: MediaResourceType.auto,
            type: MediaType.upload,
            url: faker.image.url()
          }
        })
        .expect(404)
    })

    it('should return 400 when payout request status is not approved', async () => {
      const pendingRequest = await payoutRequestModel.create({
        ...testPayoutRequest,
        _id: new Types.ObjectId(),
        status: PayoutRequestStatus.PENDING
      })
      const transactionCode = faker.string.alphanumeric(10)

      await request(global.app.getHttpServer())
        .patch(`/payout-requests/management/${pendingRequest._id}/make-payout`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({
          transactionCode,
          attachment: {
            asset_id: 'asset_id',
            public_id: 'public_id',
            resource_type: MediaResourceType.auto,
            type: MediaType.upload,
            url: faker.image.url()
          }
        })
        .expect(400)
    })

    it('should return 400 when request already has made payout', async () => {
      const paidRequest = await payoutRequestModel.create({
        ...testPayoutRequest,
        _id: new Types.ObjectId(),
        status: PayoutRequestStatus.APPROVED,
        hasMadePayout: true
      })
      const transactionCode = faker.string.alphanumeric(10)

      await request(global.app.getHttpServer())
        .patch(`/payout-requests/management/${paidRequest._id}/make-payout`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({
          transactionCode,
          attachment: {
            asset_id: 'asset_id',
            public_id: 'public_id',
            resource_type: MediaResourceType.auto,
            type: MediaType.upload,
            url: faker.image.url()
          }
        })
        .expect(400)
    })
  })
})
