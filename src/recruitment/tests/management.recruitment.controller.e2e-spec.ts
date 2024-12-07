import { RecruitmentStatus, UserRole } from '@common/contracts/constant'
import { Errors } from '@common/contracts/error'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Recruitment } from '@recruitment/schemas/recruitment.schema'
import { Model, Types } from 'mongoose'
import * as request from 'supertest'

describe('ManagementRecruitmentController (e2e)', () => {
  let recruitmentModel: Model<Recruitment>
  let testStaffId = new Types.ObjectId()
  let handledStaffId = new Types.ObjectId()
  let handledRecruitmentStaffAccessToken: string
  let staffAccessToken: string
  let recruitmentTestData = {
    _id: new Types.ObjectId(),
    applicationInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      cv: 'link_to_cv',
      note: 'Looking forward to this opportunity.'
    },
    status: RecruitmentStatus.PENDING,
    isInstructorAdded: false
  }
  let interviewingRecruitmentTest = {
    _id: new Types.ObjectId(),
    applicationInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      cv: 'link_to_cv',
      note: 'Looking forward to this opportunity.'
    },
    handledBy: handledStaffId,
    status: RecruitmentStatus.INTERVIEWING,
    isInstructorAdded: false
  }

  beforeAll(async () => {
    const jwtService = global.rootModule.get(JwtService)
    const configService = global.rootModule.get(ConfigService)
    recruitmentModel = global.rootModule.get(getModelToken(Recruitment.name))

    // Generate access token to be used in the tests
    handledRecruitmentStaffAccessToken = jwtService.sign(
      {
        sub: handledStaffId,
        role: UserRole.STAFF
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    staffAccessToken = jwtService.sign(
      {
        sub: testStaffId,
        role: UserRole.STAFF
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    // Insert test data
    await recruitmentModel.insertMany([recruitmentTestData, interviewingRecruitmentTest])
  })

  afterAll(async () => {
    // Clean up test data
    await recruitmentModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('GET recruitments/management', () => {
    it('should return recruitment list', async () => {
      const response = await request(global.app.getHttpServer())
        .get('/recruitments/management')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .query({
          name: recruitmentTestData.applicationInfo.name,
          email: recruitmentTestData.applicationInfo.email,
          status: RecruitmentStatus.PENDING
        })
        .expect(200)

      expect(response.body.data.docs).toBeInstanceOf(Array)
    })
  })

  describe('GET recruitments/management/:id', () => {
    it('should return recruitment detail', async () => {
      const recruitment = await recruitmentModel.findOne()
      const response = await request(global.app.getHttpServer())
        .get(`/recruitments/management/${recruitment._id}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(response.body.data).toHaveProperty('_id', recruitment._id.toString())
    })

    it('should return 404 if recruitment not found', async () => {
      const response = await request(global.app.getHttpServer())
        .get(`/recruitments/management/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)

      expect(response.body.error).toBe(Errors.RECRUITMENT_NOT_FOUND.error)
    })
  })

  describe('PATCH recruitments/management/:id/process-application', () => {
    it('should return 404 if recruitment not found', async () => {
      const response = await request(global.app.getHttpServer())
        .patch(`/recruitments/management/${new Types.ObjectId()}/process-application`)
        .set('Authorization', `Bearer ${handledRecruitmentStaffAccessToken}`)
        .send({
          meetingUrl: 'https://meet.google.com/abc-xyz',
          meetingDate: new Date().toISOString()
        })
        .expect(404)

      expect(response.body.error).toBe(Errors.RECRUITMENT_NOT_FOUND.error)
    })

    it('should process recruitment application', async () => {
      const response = await request(global.app.getHttpServer())
        .patch(`/recruitments/management/${recruitmentTestData._id.toString()}/process-application`)
        .set('Authorization', `Bearer ${handledRecruitmentStaffAccessToken}`)
        .send({
          meetingUrl: 'https://meet.google.com/abc-xyz',
          meetingDate: new Date().toISOString()
        })
        .expect(200)

      expect(response.body.data.success).toBe(true)
    })

    it('should throw 400 if recruitment status is invalid', async () => {
      const response = await request(global.app.getHttpServer())
        .patch(`/recruitments/management/${recruitmentTestData._id.toString()}/process-application`)
        .set('Authorization', `Bearer ${handledRecruitmentStaffAccessToken}`)
        .send({
          meetingUrl: 'https://meet.google.com/abc-xyz',
          meetingDate: new Date().toISOString()
        })
        .expect(400)

      expect(response.body.error).toBe(Errors.RECRUITMENT_STATUS_INVALID.error)
    })
  })

  describe('PATCH recruitments/management/:id/process-interview', () => {
    it('should throw 400 if recruitment is in charged by another staff', async () => {
      const response = await request(global.app.getHttpServer())
        .patch(`/recruitments/management/${recruitmentTestData._id.toString()}/process-interview`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(400)

      expect(response.body.error).toBe(Errors.RECRUITMENT_IS_IN_CHARGED_BY_ANOTHER_STAFF.error)
    })

    it('should process recruitment interview', async () => {
      const response = await request(global.app.getHttpServer())
        .patch(`/recruitments/management/${recruitmentTestData._id.toString()}/process-interview`)
        .set('Authorization', `Bearer ${handledRecruitmentStaffAccessToken}`)
        .expect(200)

      expect(response.body.data.success).toBe(true)
    })

    it('should return 404 if recruitment not found', async () => {
      const response = await request(global.app.getHttpServer())
        .patch(`/recruitments/management/${new Types.ObjectId()}/process-interview`)
        .set('Authorization', `Bearer ${handledRecruitmentStaffAccessToken}`)
        .expect(404)

      expect(response.body.error).toBe(Errors.RECRUITMENT_NOT_FOUND.error)
    })

    it('should throw 400 if recruitment status is invalid', async () => {
      const recruitment = await recruitmentModel.findOne()
      const response = await request(global.app.getHttpServer())
        .patch(`/recruitments/management/${recruitment._id}/process-interview`)
        .set('Authorization', `Bearer ${handledRecruitmentStaffAccessToken}`)
        .expect(400)

      expect(response.body.error).toBe(Errors.RECRUITMENT_STATUS_INVALID.error)
    })
  })

  describe('PATCH recruitments/management/:id/reject-process', () => {
    it('should return 404 if recruitment not found', async () => {
      const response = await request(global.app.getHttpServer())
        .patch(`/recruitments/management/${new Types.ObjectId()}/reject-process`)
        .set('Authorization', `Bearer ${handledRecruitmentStaffAccessToken}`)
        .send({
          rejectReason: 'Not suitable for the position.'
        })
        .expect(404)

      expect(response.body.error).toBe(Errors.RECRUITMENT_NOT_FOUND.error)
    })

    it('should throw 400 if recruitment status is invalid', async () => {
      const response = await request(global.app.getHttpServer())
        .patch(`/recruitments/management/${recruitmentTestData._id}/reject-process`)
        .set('Authorization', `Bearer ${handledRecruitmentStaffAccessToken}`)
        .send({ rejectReason: 'Not suitable for the position.' })
        .expect(400)

      expect(response.body.error).toBe(Errors.RECRUITMENT_STATUS_INVALID.error)
    })

    it('should throw 400 if recruitment is in charged by another staff', async () => {
      const response = await request(global.app.getHttpServer())
        .patch(`/recruitments/management/${interviewingRecruitmentTest._id}/reject-process`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({ rejectReason: 'Not suitable for the position.' })
        .expect(400)

      expect(response.body.error).toBe(Errors.RECRUITMENT_IS_IN_CHARGED_BY_ANOTHER_STAFF.error)
    })

    it('should reject recruitment process', async () => {
      const response = await request(global.app.getHttpServer())
        .patch(`/recruitments/management/${interviewingRecruitmentTest._id}/reject-process`)
        .set('Authorization', `Bearer ${handledRecruitmentStaffAccessToken}`)
        .send({ rejectReason: 'Not suitable for the position.' })
        .expect(200)

      expect(response.body.data.success).toBe(true)
    })
  })
})
