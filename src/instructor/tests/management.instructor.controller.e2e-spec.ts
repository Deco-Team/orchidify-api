import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker';
import { UserRole, InstructorStatus, RecruitmentStatus } from '@common/contracts/constant'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Recruitment } from '@recruitment/schemas/recruitment.schema'

describe('ManagementInstructorController (e2e)', () => {
  let instructorModel: Model<Instructor>
  let recruitmentModel: Model<Recruitment>
  let jwtService: JwtService
  let configService: ConfigService
  const mockStaffId = new Types.ObjectId()
  const mockInstructorId = new Types.ObjectId()
  let staffAccessToken: string

  const testInstructor = {
    _id: mockInstructorId.toString(),
    name: faker.company.name(),
    email: faker.internet.email().toLocaleLowerCase(),
    phone: faker.phone.number({ style: 'international' }),
    avatar: faker.image.avatar(),
    idCardPhoto: faker.image.avatar(),
    dateOfBirth: faker.date.past({ years: 20, refDate: '2000-10-10' }),
    password: faker.internet.password(),
    status: InstructorStatus.ACTIVE
  }

  const newInstructor = {
    name: faker.company.name(),
    email: faker.internet.email().toLocaleLowerCase(),
    phone: faker.phone.number({ style: 'international' }),
    dateOfBirth: faker.date.past({ years: 20, refDate: '2000-10-10' }),
    idCardPhoto: faker.image.avatar()
  }

  const testRecruitment = {
    _id: new Types.ObjectId().toString(),
    status: RecruitmentStatus.SELECTED,
    isInstructorAdded: false,
    applicationInfo: {
      email: newInstructor.email,
      name: newInstructor.name,
      phone: newInstructor.phone,
      cv: faker.image.url(),
      note: faker.lorem.text()
    }
  }

  beforeAll(async () => {
    instructorModel = global.rootModule.get(getModelToken(Instructor.name))
    recruitmentModel = global.rootModule.get(getModelToken(Recruitment.name))
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

    await instructorModel.create(testInstructor)
    await recruitmentModel.create(testRecruitment)
  })

  afterAll(async () => {
    await instructorModel.deleteMany({})
    await recruitmentModel.deleteMany({})
  })

  describe('GET /instructors/management', () => {
    it('should return instructor list when staff token is valid', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/instructors/management')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
      expect(data.docs[0].name).toBe(testInstructor.name)
    })

    it('should return 401 when token is invalid', async () => {
      await request(global.app.getHttpServer())
        .get('/instructors/management')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)
    })
  })

  describe('GET /instructors/management/:id', () => {
    it('should return instructor detail', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/instructors/management/${mockInstructorId}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(mockInstructorId.toString())
      expect(data.name).toBe(testInstructor.name)
    })

    it('should return 404 when instructor not found', async () => {
      const nonExistentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .get(`/instructors/management/${nonExistentId}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })
  })

  describe('POST /instructors/management', () => {
    it('should create new instructor', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .post('/instructors/management')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send(newInstructor)
        .expect(201)

      expect(status).toBe(201)
      expect(data._id).toBeDefined()
    })

    it('should return 400 when email already exists', async () => {
      const duplicateInstructor = {
        name: faker.company.name(),
        email: testInstructor.email, // Using existing email
        phone: faker.phone.number({ style: 'international' }),
        dateOfBirth: faker.date.past({ years: 20, refDate: '2000-10-10' }),
        idCardPhoto: faker.internet.url()
      }
    
      await request(global.app.getHttpServer())
        .post('/instructors/management')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send(duplicateInstructor)
        .expect(400)
    })

    it('should return 400 when recruitment application not found', async () => {
      const invalidRecruitmentInstructor = {
        name: faker.company.name(),
        email: faker.internet.email(),
        phone: faker.phone.number({ style: 'international' }),
        dateOfBirth: faker.date.past({ years: 20, refDate: '2000-10-10' }),
        idCardPhoto: faker.internet.url()
      }
    
      await request(global.app.getHttpServer())
        .post('/instructors/management')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send(invalidRecruitmentInstructor)
        .expect(400)
    })
  })

  describe('PUT /instructors/management/:id', () => {
    it('should update instructor', async () => {
      const updateData = {
        name: faker.company.name(),
        phone: faker.phone.number({ style: 'international' })
      }

      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .put(`/instructors/management/${mockInstructorId}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send(updateData)
        .expect(200)

      expect(status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('PATCH /instructors/management/:id/deactivate', () => {
    it('should deactivate instructor', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .patch(`/instructors/management/${mockInstructorId}/deactivate`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.success).toBe(true)

      const updatedInstructor = await instructorModel.findById(mockInstructorId)
      expect(updatedInstructor.status).toBe(InstructorStatus.INACTIVE)
    })
  })

  describe('PATCH /instructors/management/:id/active', () => {
    it('should activate instructor', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .patch(`/instructors/management/${mockInstructorId}/active`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.success).toBe(true)

      const updatedInstructor = await instructorModel.findById(mockInstructorId)
      expect(updatedInstructor.status).toBe(InstructorStatus.ACTIVE)
    })
  })
})
