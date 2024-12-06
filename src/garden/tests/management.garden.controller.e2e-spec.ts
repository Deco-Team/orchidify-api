import { GardenStatus, UserRole, Weekday } from '@common/contracts/constant'
import { Errors } from '@common/contracts/error'
import { GardenManager, GardenManagerDocument } from '@garden-manager/schemas/garden-manager.schema'
import { CreateGardenDto } from '@garden/dto/create-garden.dto'
import { UpdateGardenDto } from '@garden/dto/update-garden.dto'
import { Garden, GardenDocument } from '@garden/schemas/garden.schema'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { TestingModule } from '@nestjs/testing'
import { Model, Types } from 'mongoose'
import * as request from 'supertest'

describe('ManagementGardenController', () => {
  const app: INestApplication = global.app
  let staffAccessToken: string
  let gardenManagerAccessToken: string
  let gardenModel: Model<GardenDocument>
  let gardenManagerModel: Model<GardenManagerDocument>
  let gardenManagerTestData = {
    _id: '60d21b4667d0d8992e610c85',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashedpassword123',
    idCardPhoto: 'https://example.com/id-card.jpg'
  }
  let gardenTestData = [
    {
      _id: new Types.ObjectId(),
      name: 'Rose Garden',
      description: 'A beautiful garden with a variety of roses.',
      address: '123 Rose St, Flower City',
      addressLink: 'http://maps.example.com/rosegarden',
      images: ['https://example.com/rosegarden.jpg', 'https://example.com/rosegarden2.jpg'],
      maxClass: 5,
      gardenManagerId: gardenManagerTestData._id
    },
    {
      _id: new Types.ObjectId(),
      name: 'Rose Garden 2',
      description: 'A beautiful garden with a variety of roses.',
      address: '123 Rose St, Flower City',
      addressLink: 'http://maps.example.com/rosegarden',
      images: ['https://example.com/rosegarden.jpg', 'https://example.com/rosegarden2.jpg'],
      maxClass: 5,
      gardenManagerId: gardenManagerTestData._id
    }
  ]

  beforeAll(async () => {
    const module: TestingModule = global.rootModule

    const jwtService = module.get(JwtService)
    const configService = module.get(ConfigService)
    gardenModel = module.get(getModelToken(Garden.name))
    gardenManagerModel = module.get(getModelToken(GardenManager.name))

    // Generate access token to be used in the tests
    staffAccessToken = jwtService.sign(
      {
        sub: new Types.ObjectId(),
        role: UserRole.STAFF
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )
    gardenManagerAccessToken = jwtService.sign(
      {
        sub: new Types.ObjectId(),
        role: UserRole.GARDEN_MANAGER
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    // Insert test data
    await gardenManagerModel.create(gardenManagerTestData)
    await gardenModel.insertMany(gardenTestData)
  })

  afterAll(async () => {
    // Clean up test data
    await gardenModel.deleteMany({})
    await gardenManagerModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('GET /gardens', () => {
    it('should return garden list', async () => {
      const response = await request(app.getHttpServer())
        .get('/gardens')
        .query({ name: gardenManagerTestData.name, address: gardenTestData[0].address, status: GardenStatus.ACTIVE })
        .set('Authorization', `Bearer ${staffAccessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.data.docs).toBeInstanceOf(Array)
    })

    it('should return garden list for garden manager', async () => {
      const response = await request(app.getHttpServer())
        .get('/gardens')
        .set('Authorization', `Bearer ${gardenManagerAccessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.data.docs).toBeInstanceOf(Array)
    })
  })

  describe('GET /gardens/:id', () => {
    it('should return garden detail', async () => {
      const response = await request(app.getHttpServer())
        .get(`/gardens/${gardenTestData[0]._id}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveProperty('_id', gardenTestData[0]._id.toString())
    })

    it('should return 404 error garden not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/gardens/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${gardenManagerAccessToken}`)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(Errors.GARDEN_NOT_FOUND.error)
    })
  })

  describe('POST /', () => {
    it('should create a garden', async () => {
      const createGardenDto: CreateGardenDto = {
        name: 'Garden 1',
        gardenManagerId: gardenManagerTestData._id,
        description: 'A beautiful garden',
        address: '123 Garden St',
        addressLink: 'http://maps.example.com/garden1',
        images: ['https://example.com/garden1.jpg'],
        maxClass: 3
      }
      const response = await request(app.getHttpServer())
        .post('/gardens')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send(createGardenDto)

      expect(response.status).toBe(201)
      expect(response.body.data).toHaveProperty('_id')
    })

    it('should return 400 garden name already exists', async () => {
      const createGardenDto: CreateGardenDto = {
        name: gardenTestData[0].name,
        gardenManagerId: gardenManagerTestData._id,
        description: 'A beautiful garden',
        address: '123 Garden St',
        addressLink: 'http://maps.example.com/garden1',
        images: ['https://example.com/garden1.jpg'],
        maxClass: 3
      }
      const response = await request(app.getHttpServer())
        .post('/gardens')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send(createGardenDto)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe(Errors.GARDEN_NAME_EXISTED.error)
    })
  })

  describe('PUT /:id', () => {
    it('should update a garden', async () => {
      const updateGardenDto: UpdateGardenDto = {
        name: 'Updated Garden',
        gardenManagerId: gardenManagerTestData._id
      }

      const response = await request(app.getHttpServer())
        .put(`/gardens/${gardenTestData[0]._id}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send(updateGardenDto)

      expect(response.status).toBe(200)
      expect(response.body.data).toMatchObject({ success: true })
    })

    it('should return 404 error garden not found', async () => {
      const updateGardenDto: UpdateGardenDto = { name: 'Updated Garden' }

      const response = await request(app.getHttpServer())
        .put(`/gardens/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${gardenManagerAccessToken}`)
        .send(updateGardenDto)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(Errors.GARDEN_NOT_FOUND.error)
    })

    it('should return 404 error garden manager not found', async () => {
      const updateGardenDto: UpdateGardenDto = {
        name: 'Updated Garden',
        gardenManagerId: new Types.ObjectId().toString()
      }

      const response = await request(app.getHttpServer())
        .put(`/gardens/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send(updateGardenDto)

      expect(response.status).toBe(404)
      expect(response.body.error).toBe(Errors.GARDEN_MANAGER_NOT_FOUND.error)
    })
  })

  describe('PATCH /gardens/:id/deactivate', () => {
    it('should deactivate a garden', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/gardens/${gardenTestData[0]._id}/deactivate`)
        .set('Authorization', `Bearer ${staffAccessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.data).toMatchObject({ success: true })
    })
  })

  describe('PATCH /gardens/:id/active', () => {
    it('should activate a garden', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/gardens/${gardenTestData[0]._id}/active`)
        .set('Authorization', `Bearer ${staffAccessToken}`)

      expect(response.status).toBe(200)
      expect(response.body.data).toMatchObject({ success: true })
    })
  })

  describe('GET /gardens/available', () => {
    it('should return available garden list', async () => {
      const query = {
        startDate: new Date(),
        duration: 1,
        weekdays: [Weekday.MONDAY, Weekday.THURSDAY],
        slotNumbers: [1],
        instructorId: new Types.ObjectId().toString()
      }
      const response = await request(app.getHttpServer())
        .get('/gardens/available')
        .query(query)
        .set('Authorization', `Bearer ${staffAccessToken}`)
      expect(response.status).toBe(200)
      expect(response.body.data.docs).toBeInstanceOf(Array)
    })
  })
})
