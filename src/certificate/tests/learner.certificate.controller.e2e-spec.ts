import { Certificate, CertificateDocument } from '@certificate/schemas/certificate.schema'
import { LearnerStatus, UserRole } from '@common/contracts/constant'
import { Errors } from '@common/contracts/error'
import { Learner, LearnerDocument } from '@learner/schemas/learner.schema'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import * as request from 'supertest'

describe('Learner Certificate Controller (e2e)', () => {
  let accessToken: string
  let learnerModel: Model<LearnerDocument>
  let certificateModel: Model<CertificateDocument>
  let learnerTestData = {
    _id: new Types.ObjectId(),
    email: 'learner@gmail.com',
    password: 'aA@123456',
    name: 'Orchidfy Learner',
    avatar: 'avatar',
    status: LearnerStatus.ACTIVE
  }
  let certificateTestData = {
    _id: new Types.ObjectId(),
    url: 'https://certificate.com',
    ownerId: learnerTestData._id,
    learnerClassId: new Types.ObjectId()
  }

  beforeAll(async () => {
    const jwtService = global.rootModule.get(JwtService)
    const configService = global.rootModule.get(ConfigService)
    learnerModel = global.rootModule.get(getModelToken(Learner.name))
    certificateModel = global.rootModule.get(getModelToken(Certificate.name))

    // Generate access token to be used in the tests
    accessToken = jwtService.sign(
      {
        sub: learnerTestData._id,
        role: UserRole.LEARNER
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    // Insert test data
    await learnerModel.create(learnerTestData)
    await certificateModel.create(certificateTestData)
  })

  afterAll(async () => {
    // Clean up test data
    await learnerModel.deleteMany({})
    await certificateModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('GET /certificates/learners', () => {
    it('should return 200 OK with certificate list', async () => {
      const {
        status,
        body: { data }
      } = await request(global.app.getHttpServer())
        .get('/certificates/learners')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(status).toBe(200)
      expect(data.docs).toHaveLength(1)
      expect(data.docs[0]._id).toBe(certificateTestData._id.toString())
    })
  })

  describe('GET /certificates/learners/:id', () => {
    it('should return 200 OK with certificate detail', async () => {
      const {
        status,
        body: { data }
      } = await request(global.app.getHttpServer())
        .get(`/certificates/learners/${certificateTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(status).toBe(200)
      expect(data._id).toBe(certificateTestData._id.toString())
    })

    it('should return 404 Not Found if certificate not found', async () => {
      const {
        status,
        body: { error }
      } = await request(global.app.getHttpServer())
        .get(`/certificates/learners/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(status).toBe(404)
      expect(error).toBe(Errors.CERTIFICATE_NOT_FOUND.error)
    })
  })
})
