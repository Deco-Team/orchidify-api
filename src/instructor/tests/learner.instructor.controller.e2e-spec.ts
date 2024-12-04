import * as request from 'supertest'
import { Types } from 'mongoose'
import { UserRole } from '@common/contracts/constant'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

describe('LearnerInstructorController (e2e)', () => {
  let instructorModel
  let jwtService: JwtService
  let configService: ConfigService
  const mockInstructorId = new Types.ObjectId()
  const mockLearnerId = new Types.ObjectId()
  let learnerAccessToken: string

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

    // Create valid learner access token
    learnerAccessToken = jwtService.sign(
      {
        sub: mockLearnerId.toString(),
        role: UserRole.LEARNER
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    // Insert test instructor data
    await instructorModel.create(testInstructor)
  })

  afterAll(async () => {
    // Clean up test data
    await instructorModel.deleteMany({})
  })

  describe('GET /instructors/learner/:id', () => {
    it('should return instructor details when ID exists', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/instructors/learner/${mockInstructorId}`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(mockInstructorId.toString())
      expect(data.name).toBe(testInstructor.name)
      expect(data.email).toBe(testInstructor.email)
    })

    it('should return 404 when instructor ID does not exist', async () => {
      const nonExistentId = new Types.ObjectId()
      
      await request(global.app.getHttpServer())
        .get(`/instructors/learner/${nonExistentId}`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(404)
    })

    it('should return 401 when token is invalid', async () => {
      await request(global.app.getHttpServer())
        .get(`/instructors/learner/${mockInstructorId}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)
    })
  })
})
