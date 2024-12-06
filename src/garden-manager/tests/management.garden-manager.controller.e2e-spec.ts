import { getModelToken } from '@nestjs/mongoose'
import * as request from 'supertest'
import { CreateGardenManagerDto } from '../dto/create-garden-manager.dto'
import { UpdateGardenManagerDto } from '../dto/update-garden-manager.dto'
import { Model, Types } from 'mongoose'
import { GardenManagerStatus, UserRole } from '@common/contracts/constant'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { GardenManager, GardenManagerDocument } from '@garden-manager/schemas/garden-manager.schema'
import { Errors } from '@common/contracts/error'
import { Garden, GardenDocument } from '@garden/schemas/garden.schema'

describe('ManagementGardenManagerController (e2e)', () => {
  let accessToken: string
  let gardenManagerModel: Model<GardenManagerDocument>
  let gardenModel: Model<GardenDocument>
  let gardenManagerTestData = {
    _id: new Types.ObjectId(),
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashedpassword123',
    idCardPhoto: 'https://idCardPhoto3.com'
  }
  let gardenTestData = {
    _id: new Types.ObjectId(),
    name: 'Rose Garden',
    description: 'A beautiful garden with a variety of roses.',
    address: '123 Rose St, Flower City',
    addressLink: 'http://maps.example.com/rosegarden',
    images: ['https://image1.com', 'https://image2.com'],
    maxClass: 5,
    gardenManagerId: gardenManagerTestData._id
  }

  beforeAll(async () => {
    const jwtService = global.rootModule.get(JwtService)
    const configService = global.rootModule.get(ConfigService)
    gardenManagerModel = global.rootModule.get(getModelToken(GardenManager.name))
    gardenModel = global.rootModule.get(getModelToken(Garden.name))

    // Generate access token to be used in the tests
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
    await gardenManagerModel.create(gardenManagerTestData)
    await gardenModel.create(gardenTestData)
  })

  afterAll(async () => {
    // Clean up test data
    await gardenManagerModel.deleteMany({})
    await gardenModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('GET /garden-managers', () => {
    it('should return garden manager list', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .get('/garden-managers')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          name: gardenManagerTestData.name,
          email: gardenManagerTestData.email,
          status: GardenManagerStatus.ACTIVE
        })
      expect(status).toBe(200)
      expect(body.data.docs).toBeInstanceOf(Array)
    })
  })

  describe('GET /garden-managers/:id', () => {
    it('should return garden manager detail', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .get(`/garden-managers/${gardenManagerTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(200)
      expect(body.data).toMatchObject({ _id: gardenManagerTestData._id.toString() })
    })

    it('should return 404 if garden manager not found', async () => {
      const gardenManagerId = new Types.ObjectId().toString()
      const { status, body } = await request(global.app.getHttpServer())
        .get(`/garden-managers/${gardenManagerId}`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(404)
      expect(body.error).toBe(Errors.GARDEN_MANAGER_NOT_FOUND.error)
    })
  })

  describe('POST /garden-managers', () => {
    it('should create a garden manager', async () => {
      const createGardenManagerDto: CreateGardenManagerDto = {
        email: 'test@gmail.com',
        name: 'Test Garden Manager',
        idCardPhoto: 'https://idCardPhoto3.com'
      }
      const { status, body } = await request(global.app.getHttpServer())
        .post('/garden-managers')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createGardenManagerDto)
      expect(status).toBe(201)
      expect(body.data).toHaveProperty('_id')
    })

    it('should return 400 if email already exists', async () => {
      const createGardenManagerDto: CreateGardenManagerDto = {
        email: 'john.doe@example.com',
        name: 'Test Garden Manager',
        idCardPhoto: 'https://idCardPhoto3.com'
      }
      const { status, body } = await request(global.app.getHttpServer())
        .post('/garden-managers')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createGardenManagerDto)
      expect(status).toBe(400)
      expect(body.error).toBe(Errors.EMAIL_ALREADY_EXIST.error)
    })
  })

  describe('PUT /garden-managers/:id', () => {
    it('should update a garden manager', async () => {
      const updateGardenManagerDto: UpdateGardenManagerDto = {
        name: 'Updated Garden Manager'
      }
      const { status, body } = await request(global.app.getHttpServer())
        .put(`/garden-managers/${gardenManagerTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateGardenManagerDto)
      expect(status).toBe(200)
      expect(body.data).toMatchObject({ success: true })
    })

    it('should return 404 if garden manager not found', async () => {
      const gardenManagerId = new Types.ObjectId().toString()

      const updateGardenManagerDto: UpdateGardenManagerDto = {
        name: 'Updated Garden Manager'
      }
      const { status, body } = await request(global.app.getHttpServer())
        .put(`/garden-managers/${gardenManagerId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateGardenManagerDto)
      expect(status).toBe(404)
      expect(body.error).toBe(Errors.GARDEN_MANAGER_NOT_FOUND.error)
    })
  })

  describe('PATCH /garden-managers/:id/deactivate', () => {
    it('should deactivate a garden manager', async () => {
      const gardenManagerId = new Types.ObjectId().toString()
      const { status, body } = await request(global.app.getHttpServer())
        .patch(`/garden-managers/${gardenManagerId}/deactivate`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(200)
      expect(body.data).toMatchObject({ success: true })
    })

    it('should return 400 if garden manager is assigned to a garden', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .patch(`/garden-managers/${gardenManagerTestData._id}/deactivate`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(400)
      expect(body.error).toBe(Errors.GARDEN_MANAGER_IS_ASSIGNED_TO_GARDEN.error)
    })
  })

  describe('PATCH /garden-managers/:id/active', () => {
    it('should activate a garden manager', async () => {
      const gardenManagerId = new Types.ObjectId().toString()
      const { status, body } = await request(global.app.getHttpServer())
        .patch(`/garden-managers/${gardenManagerId}/active`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(200)
      expect(body.data).toMatchObject({ success: true })
    })
  })
})
