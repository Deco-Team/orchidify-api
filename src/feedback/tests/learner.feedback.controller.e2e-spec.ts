import { Class, ClassDocument } from '@class/schemas/class.schema'
import { LearnerClass, LearnerClassDocument } from '@class/schemas/learner-class.schema'
import { CourseStatus, UserRole } from '@common/contracts/constant'
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
  let learnerClassModel: Model<LearnerClassDocument>
  let accessToken: string
  let instructorTestId = new Types.ObjectId()
  let learnerTestId = new Types.ObjectId()
  let courseTestData = {
    _id: new Types.ObjectId(),
    code: 'OCP031',
    title: 'Thế giới Hoa lan: Căn bản nhất',
    description: 'Học cách chăm sóc và trồng hoa lan cơ bản nhất',
    instructorId: instructorTestId
  }
  let classNotEnrolledTestData = {
    _id: new Types.ObjectId(),
    code: 'OCP030',
    title: 'Thế giới Hoa lan: Căn bản nhất',
    description: 'Học cách chăm sóc và trồng hoa lan cơ bản nhất 0',
    price: 750000,
    level: 'BASIC',
    thumbnail: 'https://thumb.com/123.jpg',
    media: [],
    instructorId: instructorTestId,
    courseId: courseTestData._id,
    progress: 0
  }
  let classNotSubmittedFeedbackTestData = {
    _id: new Types.ObjectId(),
    code: 'OCP031',
    title: 'Thế giới Hoa lan: Căn bản nhất',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    duration: 1,
    weekdays: ['Monday', 'Thursday'],
    slotNumbers: [1],
    description: 'Học cách chăm sóc và trồng hoa lan cơ bản nhất',
    price: 750000,
    level: 'BASIC',
    thumbnail: 'https://thumb.com/123.jpg',
    media: [],
    instructorId: instructorTestId,
    courseId: courseTestData._id,
    progress: 0
  }
  let classNotOpenFeedbackTestData = {
    _id: new Types.ObjectId(),
    code: 'OCP031',
    title: 'Thế giới Hoa lan: Căn bản nhất',
    startDate: new Date(Date.now()).toISOString(),
    duration: 1,
    weekdays: ['Monday', 'Thursday'],
    slotNumbers: [1],
    description: 'Học cách chăm sóc và trồng hoa lan cơ bản nhất',
    price: 750000,
    level: 'BASIC',
    thumbnail: 'https://thumb.com/123.jpg',
    media: [],
    instructorId: instructorTestId,
    courseId: courseTestData._id,
    progress: 0
  }
  let classSubmittedFeedbackTestData = {
    _id: new Types.ObjectId(),
    code: 'OCP032',
    title: 'Thế giới Hoa lan: Căn bản nhất 2',
    description: 'Học cách chăm sóc và trồng hoa lan cơ bản nhất',
    price: 750000,
    level: 'BASIC',
    thumbnail: 'https://thumb.com/123.jpg',
    media: [],
    instructorId: instructorTestId,
    courseId: courseTestData._id,
    progress: 0
  }
  let learnerClassTestData = [
    {
      _id: new Types.ObjectId(),
      enrollDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      transactionId: new Types.ObjectId(),
      learnerId: learnerTestId,
      classId: classNotSubmittedFeedbackTestData._id,
      courseId: new Types.ObjectId()
    },
    {
      _id: new Types.ObjectId(),
      enrollDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      transactionId: new Types.ObjectId(),
      learnerId: learnerTestId,
      classId: classNotOpenFeedbackTestData._id,
      courseId: new Types.ObjectId()
    }
  ]
  let feedbackTestData = {
    _id: new Types.ObjectId(),
    courseId: courseTestData._id,
    rate: 5,
    classId: classSubmittedFeedbackTestData._id,
    learnerId: learnerTestId
  }

  beforeAll(async () => {
    const jwtService = global.rootModule.get(JwtService)
    const configService = global.rootModule.get(ConfigService)
    courseModel = global.rootModule.get(getModelToken(Course.name))
    classModel = global.rootModule.get(getModelToken(Class.name))
    feedbackModel = global.rootModule.get(getModelToken(Feedback.name))
    learnerClassModel = global.rootModule.get(getModelToken(LearnerClass.name))

    // Generate access token to be used in the tests
    accessToken = jwtService.sign(
      {
        sub: learnerTestId,
        role: UserRole.LEARNER
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    // Insert test data
    await courseModel.create(courseTestData)
    await classModel.insertMany([classNotSubmittedFeedbackTestData, classSubmittedFeedbackTestData, classNotOpenFeedbackTestData])
    await feedbackModel.create(feedbackTestData)
    await learnerClassModel.create(learnerClassTestData)
  })

  afterAll(async () => {
    // Clean up test data
    await courseModel.deleteMany({})
    await classModel.deleteMany({})
    await feedbackModel.deleteMany({})
    await learnerClassModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('GET feedbacks/learner/courses/:courseId', () => {
    it('should return the course feedback list', async () => {
      const {
        status,
        body: { data }
      } = await request(global.app.getHttpServer())
        .get(`/feedbacks/learner/courses/${courseTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(200)
      expect(data.docs).toHaveLength(1)
    })
  })

  describe('GET feedbacks/learner/classes/:classId', () => {
    it('should return the class feedback list', async () => {
      const {
        status,
        body: { data }
      } = await request(global.app.getHttpServer())
        .get(`/feedbacks/learner/classes/${classSubmittedFeedbackTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(200)
      expect(data.docs).toHaveLength(1)
    })

    it('should return empty list if the class has no feedback match filter', async () => {
      const {
        status,
        body: { data }
      } = await request(global.app.getHttpServer())
        .get(`/feedbacks/learner/classes/${classSubmittedFeedbackTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ rate: 1 })
      expect(status).toBe(200)
      expect(data.docs).toHaveLength(0)
    })
  })

  describe('POST feedbacks/learner/:classId', () => {
    it('should send feedback successfully', async () => {
      const {
        status,
        body: { data }
      } = await request(global.app.getHttpServer())
        .post(`/feedbacks/learner/${classNotSubmittedFeedbackTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ rate: 5, comment: 'Great course' })

      expect(status).toBe(201)
      expect(data).toMatchObject({ success: true })

      const feedback = await feedbackModel.findOne({
        classId: classNotSubmittedFeedbackTestData._id,
        learnerId: learnerTestId
      })
      expect(feedback).toBeDefined()
    })

    it('should return 400 if the class is not open for feedback', async () => {
      const {
        status,
        body: { error }
      } = await request(global.app.getHttpServer())
        .post(`/feedbacks/learner/${classNotOpenFeedbackTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ rate: 5, comment: 'Great course' })

      expect(status).toBe(400)
      expect(error).toBe(Errors.FEEDBACK_NOT_OPEN_YET.error)
    })

    it('should return 400 if the feedback has been submitted', async () => {
      const {
        status,
        body: { error }
      } = await request(global.app.getHttpServer())
        .post(`/feedbacks/learner/${classSubmittedFeedbackTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ rate: 5, comment: 'Great course' })

      expect(status).toBe(400)
      expect(error).toBe(Errors.FEEDBACK_SUBMITTED.error)
    })

    it('should return 400 if learner has not enrolled in the class yet', async () => {
      const {
        status,
        body: { error }
      } = await request(global.app.getHttpServer())
        .post(`/feedbacks/learner/${classNotEnrolledTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ rate: 5, comment: 'Great course' })

      expect(status).toBe(400)
      expect(error).toBe(Errors.NOT_ENROLL_CLASS_YET.error)
    })
  })

  describe('GET feedbacks/learner/:classId', () => {
    it('should return the feedback of the learner in the class', async () => {
      const {
        status,
        body: { data }
      } = await request(global.app.getHttpServer())
        .get(`/feedbacks/learner/${classSubmittedFeedbackTestData._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(200)
      expect(data).toMatchObject({
        learnerId: learnerTestId.toString(),
        classId: classSubmittedFeedbackTestData._id.toString()
      })
    })

    it('should return 404 if the feedback is not found', async () => {
      const {
        status,
        body: { error }
      } = await request(global.app.getHttpServer())
        .get(`/feedbacks/learner/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
      expect(status).toBe(404)
      expect(error).toBe(Errors.FEEDBACK_NOT_FOUND.error)
    })
  })
})
