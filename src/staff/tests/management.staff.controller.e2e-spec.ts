import { getModelToken } from '@nestjs/mongoose'
import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import {  StaffStatus, UserRole } from '@common/contracts/constant'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Errors } from '@common/contracts/error'
import { Staff, StaffDocument } from '@staff/schemas/staff.schema'
import { CreateStaffDto } from '@staff/dto/create-staff.dto'
import { UpdateStaffDto } from '@staff/dto/update-staff.dto'

describe('ManagementStaffController (e2e)', () => {
  let accessToken: string
  let staffTestId: string
  let staffModel: Model<StaffDocument>

  beforeAll(async () => {
    const jwtService = global.rootModule.get(JwtService)
    const configService = global.rootModule.get(ConfigService)
    staffModel = global.rootModule.get(getModelToken(Staff.name))

    // Generate access token to be used in the tests
    accessToken = jwtService.sign(
      {
        sub: new Types.ObjectId().toString(),
        role: UserRole.ADMIN
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )
  })

  afterEach(async () => {
    await staffModel.ensureIndexes()
  })

  afterAll(async () => {
    // Clean up test data
    await staffModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('POST /staffs', () => {
    it('should create a staff', async () => {
      const createStaffDto: CreateStaffDto = {
        email: 'test@gmail.com',
        name: 'Test Staff',
        idCardPhoto: 'https://idCardPhoto3.com'
      }
      const { status, body } = await request(global.app.getHttpServer())
        .post('/staffs')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createStaffDto)
      expect(status).toBe(201)
      expect(body.data).toHaveProperty('_id')
      staffTestId = body.data._id
    })

    it('should return 400 if email already exists', async () => {
      const createStaffDto: CreateStaffDto = {
        email: 'test@gmail.com',
        name: 'Test Staff',
        idCardPhoto: 'https://idCardPhoto3.com'
      }
      const { status, body } = await request(global.app.getHttpServer())
        .post('/staffs')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createStaffDto)
      expect(status).toBe(400)
      expect(body.error).toBe(Errors.EMAIL_ALREADY_EXIST.error)
    })
  })

  describe('PUT /staffs/:id', () => {
    it('should update a staff', async () => {
      const updateStaffDto: UpdateStaffDto = {
        name: 'Updated Staff'
      }
      const { status, body } = await request(global.app.getHttpServer())
        .put(`/staffs/${staffTestId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateStaffDto)
      expect(status).toBe(200)
      expect(body.data).toMatchObject({ success: true })
    })

    it('should return 404 if staff not found', async () => {
      const staffId = new Types.ObjectId().toString()

      const updateStaffDto: UpdateStaffDto = {
        name: 'Updated Staff'
      }
      const { status, body } = await request(global.app.getHttpServer())
        .put(`/staffs/${staffId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateStaffDto)
      expect(status).toBe(404)
      expect(body.error).toBe(Errors.STAFF_NOT_FOUND.error)
    })
  })

  describe('GET /staffs', () => {
    it('should return staff list', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .get('/staffs')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          name: 'Updated Staff',
          email: 'test@gmail.com',
          status: StaffStatus.ACTIVE
        })
      expect(status).toBe(200)
      expect(body.data.docs).toBeInstanceOf(Array)
    })
  })

  describe('GET /staffs/:id', () => {
    it('should return staff detail', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .get(`/staffs/${staffTestId}`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(200)
      expect(body.data).toMatchObject({ _id: staffTestId })
    })

    it('should return 404 if staff not found', async () => {
      const staffId = new Types.ObjectId().toString()
      const { status, body } = await request(global.app.getHttpServer())
        .get(`/staffs/${staffId}`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(404)
      expect(body.error).toBe(Errors.STAFF_NOT_FOUND.error)
    })
  })

  describe('PATCH /staffs/:id/deactivate', () => {
    it('should deactivate a staff', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .patch(`/staffs/${staffTestId}/deactivate`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(200)
      expect(body.data).toMatchObject({ success: true })
    })
  })

  describe('PATCH /staffs/:id/active', () => {
    it('should activate a staffstaffTestId', async () => {
      const { status, body } = await request(global.app.getHttpServer())
        .patch(`/staffs/${staffTestId}/active`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(200)
      expect(body.data).toMatchObject({ success: true })
    })
  })
})
