import { LearnerStatus, UserRole } from '@common/contracts/constant'
import { Model, Types } from 'mongoose'
import { Errors } from '@common/contracts/error'
import { getModelToken } from '@nestjs/mongoose'
import { Learner } from '@learner/schemas/learner.schema'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as request from 'supertest'

describe('ManagementLearnerController (e2e)', () => {
  let accessToken: string
  let learnerModel: Model<Learner>
  let learnerTestData = {
    _id: new Types.ObjectId(),
    email: 'learner@gmail.com',
    password: 'aA@123456',
    name: 'Orchidfy Learner',
    avatar: 'avatar',
    status: LearnerStatus.ACTIVE
  }

  beforeAll(async () => {
    learnerModel = global.rootModule.get(getModelToken(Learner.name))
    const jwtService = global.rootModule.get(JwtService)
    const configService = global.rootModule.get(ConfigService)

    // Generate valid refresh token
    accessToken = jwtService.sign(
      {
        sub: new Types.ObjectId().toString(),
        role: UserRole.STAFF
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    // Insert test data
    await learnerModel.create(learnerTestData)
  })

  afterAll(async () => {
    // Clean up test data
    await learnerModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('GET /learners/management', () => {
    it('should return learner detail', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .get('/learners/management')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ email: learnerTestData.email, name: learnerTestData.name, status: learnerTestData.status })

      expect(status).toBe(200)
      expect(body.data.docs).toBeInstanceOf(Array)
    })
  })

  describe('GET /learners/management/:id', () => {
    it('should return learner detail', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .get(`/learners/management/${learnerTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(status).toBe(200)
      expect(body.data).toHaveProperty('_id', learnerTestData._id.toString())
    })

    it('should throw error if learner not found', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .get(`/learners/management/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(status).toBe(404)
      expect(body.error).toBe(Errors.LEARNER_NOT_FOUND.error)
    })
  })

  describe('PATCH /learners/management/:id/deactivate', () => {
    it('should deactivate learner', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .patch(`/learners/management/${learnerTestData._id}/deactivate`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(status).toBe(200)
      expect(body.data.success).toBe(true)
    })
  })

  describe('PATCH /learners/management/:id/active', () => {
    it('should activate learner', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .patch(`/learners/management/${learnerTestData._id}/active`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(status).toBe(200)
      expect(body.data.success).toBe(true)
    })
  })
})
