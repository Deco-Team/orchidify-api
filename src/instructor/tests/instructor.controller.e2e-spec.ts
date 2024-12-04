import * as request from 'supertest'
import { Types } from 'mongoose'
import { UserRole } from '@common/contracts/constant'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

describe('InstructorController (e2e)', () => {
  let instructorModel
  let jwtService: JwtService
  let configService: ConfigService
  const mockInstructorId = new Types.ObjectId()
  let accessToken: string

  const testInstructor = {
    _id: mockInstructorId.toString(),
    name: 'Test Instructor',
    email: 'test@instructor.com',
    phone: '1234567890',
    avatar: 'avatar-url',
    idCardPhoto: 'id-card-photo-url',
    dateOfBirth: new Date(),
    password: 'password',
    certificates: [
      {
        name: 'Test Certificate',
        url: 'cert-image-url'
      }
    ]
  }

  beforeAll(async () => {
    instructorModel = global.rootModule.get(getModelToken(Instructor.name))
    jwtService = global.rootModule.get(JwtService)
    configService = global.rootModule.get(ConfigService)

    // Create valid access token
    accessToken = jwtService.sign(
      {
        sub: mockInstructorId.toString(),
        role: UserRole.INSTRUCTOR
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    // Insert test data
    await instructorModel.create(testInstructor)
  })

  afterAll(async () => {
    // Clean up test data
    await instructorModel.deleteMany({})
  })

  describe('GET /instructors/profile', () => {
    it('should return instructor profile when token is valid', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/instructors/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(mockInstructorId.toString())
      expect(data.name).toBe(testInstructor.name)
      expect(data.email).toBe(testInstructor.email)
    })

    it('should return 401 when token is invalid', async () => {
      await request(global.app.getHttpServer())
        .get('/instructors/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)
    })
  })

  describe('GET /instructors/certifications', () => {
    it('should return instructor certifications', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/instructors/certifications')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
      expect(data.docs[0].name).toBe(testInstructor.certificates[0].name)
    })
  })

  describe('PUT /instructors/profile', () => {
    it('should update instructor profile', async () => {
      const updateData = {
        bio: 'Updated bio',
      }

      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .put('/instructors/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200)

      expect(status).toBe(200)
      expect(data.success).toBe(true)

      // Verify update in database
      const updatedInstructor = await instructorModel.findById(mockInstructorId)
      expect(updatedInstructor.bio).toBe(updateData.bio)
    })
  })
})
