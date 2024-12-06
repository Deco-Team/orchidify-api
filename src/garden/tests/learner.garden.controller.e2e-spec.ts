import { UserRole } from '@common/contracts/constant'
import { Errors } from '@common/contracts/error'
import { Garden, GardenDocument } from '@garden/schemas/garden.schema'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { TestingModule } from '@nestjs/testing'
import { Model, Types } from 'mongoose'
import * as request from 'supertest'

describe('LearnerGardenController (e2e)', () => {
  const app: INestApplication = global.app
  let accessToken: string
  let gardenModel: Model<GardenDocument>
  let gardenTestData = {
    _id: new Types.ObjectId(),
    name: 'Rose Garden',
    description: 'A beautiful garden with a variety of roses.',
    address: '123 Rose St, Flower City',
    addressLink: 'http://maps.example.com/rosegarden',
    images: ['https://example.com/rosegarden.jpg', 'https://example.com/rosegarden2.jpg'],
    maxClass: 5,
    gardenManagerId: new Types.ObjectId()
  }

  beforeAll(async () => {
    const module: TestingModule = global.rootModule

    const jwtService = module.get(JwtService)
    const configService = module.get(ConfigService)
    gardenModel = module.get(getModelToken(Garden.name))

    // Generate access token to be used in the tests
    accessToken = jwtService.sign(
      {
        sub: new Types.ObjectId(),
        role: UserRole.LEARNER
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    // Insert test data
    await gardenModel.create(gardenTestData)
  })

  afterAll(async () => {
    // Clean up test data
    await gardenModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('GET /gardens/learner/:id', () => {
    it('should return the garden detail', async () => {
      const res = await request(app.getHttpServer())
        .get(`/gardens/learner/${gardenTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(res.body.data).toHaveProperty('_id', gardenTestData._id.toString())
    })

    it('should return 404 if the garden is not found', async () => {
      const res = await request(app.getHttpServer())
        .get(`/gardens/learner/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)

      expect(res.body.error).toBe(Errors.GARDEN_NOT_FOUND.error)
    })
  })
})
