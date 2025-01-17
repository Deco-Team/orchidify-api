import { Class, ClassDocument } from '@class/schemas/class.schema'
import { UserRole } from '@common/contracts/constant'
import { Errors } from '@common/contracts/error'
import { Course, CourseDocument } from '@course/schemas/course.schema'
import { Feedback, FeedbackDocument } from '@feedback/schemas/feedback.schema'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import * as request from 'supertest'

describe('InstructorFeedbackController (e2e)', () => {
  let courseModel: Model<CourseDocument>
  let feedbackModel: Model<FeedbackDocument>
  let classModel: Model<ClassDocument>
  let accessToken: string
  let instructorTestId = new Types.ObjectId()
  let courseTestData = {
    _id: new Types.ObjectId(),
    code: 'OCP031',
    title: 'Thế giới Hoa lan: Căn bản nhất',
    description: 'Học cách chăm sóc và trồng hoa lan cơ bản nhất',
    instructorId: instructorTestId
  }
  let classTestData = {
    _id: new Types.ObjectId(),
    code: 'OCP031',
    title: 'Thế giới Hoa lan: Căn bản nhất',
    description: 'Học cách chăm sóc và trồng hoa lan cơ bản nhất',
    price: 750000,
    level: 'BASIC',
    thumbnail: 'https://thumb.com/123.jpg',
    media: [],
    instructorId: instructorTestId,
    courseId: courseTestData._id,
    progress: 0
  }
  let feedbackTestData = {
    _id: new Types.ObjectId(),
    courseId: courseTestData._id,
    rate: 5,
    classId: classTestData._id,
    learnerId: new Types.ObjectId()
  }

  beforeAll(async () => {
    const jwtService = global.rootModule.get(JwtService)
    const configService = global.rootModule.get(ConfigService)
    courseModel = global.rootModule.get(getModelToken(Course.name))
    classModel = global.rootModule.get(getModelToken(Class.name))
    feedbackModel = global.rootModule.get(getModelToken(Feedback.name))

    // Generate access token to be used in the tests
    accessToken = jwtService.sign(
      {
        sub: instructorTestId,
        role: UserRole.INSTRUCTOR
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    // Insert test data
    await courseModel.create(courseTestData)
    await classModel.create(classTestData)
    await feedbackModel.create(feedbackTestData)
  })

  afterAll(async () => {
    // Clean up test data
    await courseModel.deleteMany({})
    await classModel.deleteMany({})
    await feedbackModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('GET feedbacks/instructor/courses/:courseId', () => {
    it('should return the course feedback list', async () => {
      const {
        status,
        body: { data }
      } = await request(global.app.getHttpServer())
        .get(`/feedbacks/instructor/courses/${courseTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(200)
      expect(data.docs).toHaveLength(1)
    })

    it('should return 404 if the course is not found', async () => {
      const {
        status,
        body: { error }
      } = await request(global.app.getHttpServer())
        .get(`/feedbacks/instructor/courses/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(404)
      expect(error).toBe(Errors.COURSE_NOT_FOUND.error)
    })
  })

  describe('GET feedbacks/instructor/classes/:classId', () => {
    it('should return the class feedback list', async () => {
      const {
        status,
        body: { data }
      } = await request(global.app.getHttpServer())
        .get(`/feedbacks/instructor/classes/${classTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(200)
      expect(data.docs).toHaveLength(1)
    })

    it('should return 404 if the class is not found', async () => {
      const {
        status,
        body: { error }
      } = await request(global.app.getHttpServer())
        .get(`/feedbacks/instructor/classes/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(404)
      expect(error).toBe(Errors.CLASS_NOT_FOUND.error)
    })
  })
})
