import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import {
  UserRole,
  ClassStatus,
  LearnerStatus,
  CourseLevel,
  SlotNumber,
  Weekday,
  SubmissionStatus,
  CourseStatus
} from '@common/contracts/constant'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Class } from '@class/schemas/class.schema'
import { Learner } from '@learner/schemas/learner.schema'
import { AssignmentSubmission } from '@class/schemas/assignment-submission.schema'
import { LearnerClass } from '@class/schemas/learner-class.schema'
import { MediaResourceType, MediaType } from '@media/contracts/constant'
import { IPaymentService } from '@transaction/services/payment.service'
import { PaymentMethod } from '@transaction/contracts/constant'
import { Course } from '@course/schemas/course.schema'

describe('LearnerClassController (e2e)', () => {
  let classModel: Model<Class>
  let courseModel: Model<Course>
  let learnerModel: Model<Learner>
  let assignmentSubmissionModel: Model<AssignmentSubmission>
  let learnerClassModel: Model<LearnerClass>
  let jwtService: JwtService
  let configService: ConfigService
  let paymentService: IPaymentService

  const mockLearnerId = new Types.ObjectId()
  const mockInstructorId = new Types.ObjectId()
  let learnerAccessToken: string

  const testLearner = {
    _id: mockLearnerId,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    status: LearnerStatus.ACTIVE,
    role: UserRole.LEARNER,
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
  }

  const testCourse = {
    _id: new Types.ObjectId(),
    code: 'OCP001',
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    price: 500000,
    level: CourseLevel.BASIC,
    type: ['Tách chiết'],
    duration: 1,
    thumbnail: faker.image.url(),
    media: [
      {
        asset_id: faker.string.uuid(),
        public_id: faker.string.uuid(),
        resource_type: MediaResourceType.video,
        type: MediaType.upload,
        url: faker.internet.url()
      }
    ],
    status: CourseStatus.ACTIVE,
    instructorId: mockInstructorId
  }

  const testClass = {
    _id: new Types.ObjectId(),
    code: 'ORCHID001',
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    startDate: new Date(),
    price: 500000,
    level: CourseLevel.BASIC,
    type: ['Tách chiết'],
    duration: 1,
    thumbnail: faker.image.url(),
    media: [
      {
        asset_id: faker.string.uuid(),
        public_id: faker.string.uuid(),
        resource_type: MediaResourceType.video,
        type: MediaType.upload,
        url: faker.internet.url()
      }
    ],
    status: ClassStatus.PUBLISHED,
    instructorId: mockInstructorId,
    courseId: testCourse._id,
    weekdays: [Weekday.MONDAY, Weekday.WEDNESDAY],
    slotNumbers: [SlotNumber.ONE],
    learnerLimit: 20,
    learnerQuantity: 0,
    sessions: [
      {
        _id: new Types.ObjectId(),
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        sessionNumber: 1,
        media: [
          {
            asset_id: faker.string.uuid(),
            public_id: faker.string.uuid(),
            resource_type: MediaResourceType.video,
            type: MediaType.upload,
            url: faker.internet.url()
          }
        ],
        assignments: [
          {
            _id: new Types.ObjectId(),
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
            attachments: [],
            deadline: faker.date.future()
          }
        ]
      }
    ],
    progress: {
      total: 1,
      completed: 0,
      percentage: 0
    }
  }

  beforeAll(async () => {
    classModel = global.rootModule.get(getModelToken(Class.name))
    courseModel = global.rootModule.get(getModelToken(Course.name))
    learnerModel = global.rootModule.get(getModelToken(Learner.name))
    assignmentSubmissionModel = global.rootModule.get(getModelToken(AssignmentSubmission.name))
    learnerClassModel = global.rootModule.get(getModelToken(LearnerClass.name))
    jwtService = global.rootModule.get(JwtService)
    configService = global.rootModule.get(ConfigService)
    paymentService = global.rootModule.get(IPaymentService)

    learnerAccessToken = jwtService.sign(
      {
        sub: mockLearnerId.toString(),
        role: UserRole.LEARNER
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    await learnerModel.create(testLearner)
    await courseModel.create(testCourse)
    await classModel.create(testClass)
  })

  afterAll(async () => {
    await classModel.deleteMany({})
    await learnerModel.deleteMany({})
    await courseModel.deleteMany({})
    await assignmentSubmissionModel.deleteMany({})
    await learnerClassModel.deleteMany({})

    jest.clearAllMocks()
  })

  describe('POST /classes/learner/enroll/:id', () => {
    it('should enroll class successfully with Stripe payment', async () => {
      jest.spyOn(paymentService, 'createTransaction').mockResolvedValue({
        id: faker.string.uuid(),
        client_secret: faker.string.uuid()
      })

      jest.spyOn(paymentService, 'getTransaction').mockResolvedValue({
        id: faker.string.uuid(),
        status: faker.string.alpha()
      })

      const response = await request(global.app.getHttpServer())
        .post(`/classes/learner/enroll/${testClass._id}`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .send({
          paymentMethod: PaymentMethod.STRIPE
        })
        .expect(201)

      expect(response.body.data).toHaveProperty('client_secret')
    })

    it('should return 400 when class is full', async () => {
      await classModel.findByIdAndUpdate(testClass._id, {
        learnerQuantity: testClass.learnerLimit
      })

      await request(global.app.getHttpServer())
        .post(`/classes/learner/enroll/${testClass._id}`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .send({
          paymentMethod: PaymentMethod.STRIPE
        })
        .expect(400)
    })
  })

  describe('GET /classes/learner/my-classes', () => {
    beforeEach(async () => {
      await learnerClassModel.create({
        learnerId: mockLearnerId,
        classId: testClass._id,
        enrollDate: new Date(),
        courseId: testClass.courseId,
        transactionId: new Types.ObjectId()
      })
    })

    it('should return my class list', async () => {
      const response = await request(global.app.getHttpServer())
        .get('/classes/learner/my-classes')
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(200)

      expect(response.body.data.docs).toBeInstanceOf(Array)
      expect(response.body.data.docs.length).toBeGreaterThan(0)
    })
  })

  describe('GET /classes/learner/my-classes/:id', () => {
    beforeEach(async () => {
      await learnerClassModel.create({
        learnerId: mockLearnerId,
        classId: testClass._id,
        enrollDate: new Date(),
        courseId: testClass.courseId,
        transactionId: new Types.ObjectId()
      })
    })

    it('should return my class detail', async () => {
      const response = await request(global.app.getHttpServer())
        .get(`/classes/learner/my-classes/${testClass._id}`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(200)

      expect(response.body.data._id).toBe(testClass._id.toString())
    })

    it('should return 404 when class not found', async () => {
      await request(global.app.getHttpServer())
        .get(`/classes/learner/my-classes/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(404)
    })
  })

  describe('GET /classes/learner/my-classes/:classId/sessions/:sessionId', () => {
    it('should return session detail', async () => {
      const sessionId = testClass.sessions[0]._id

      const response = await request(global.app.getHttpServer())
        .get(`/classes/learner/my-classes/${testClass._id}/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(200)

      expect(response.body.data.title).toBe(testClass.sessions[0].title)
    })

    it('should return 404 when session not found', async () => {
      await request(global.app.getHttpServer())
        .get(`/classes/learner/my-classes/${testClass._id}/sessions/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(404)
    })
  })

  describe('POST /classes/learner/:classId/submit-assignment', () => {
    const assignmentId = testClass.sessions[0].assignments[0]._id

    it('should submit assignment successfully', async () => {
      const response = await request(global.app.getHttpServer())
        .post(`/classes/learner/${testClass._id}/submit-assignment`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .send({
          assignmentId,
          attachments: [
            {
              asset_id: faker.string.uuid(),
              public_id: faker.string.uuid(),
              resource_type: MediaResourceType.image,
              type: MediaType.upload,
              url: faker.internet.url()
            }
          ]
        })
        .expect(201)

      const submission = await assignmentSubmissionModel.findById(response.body.data._id)
      expect(submission.status).toBe(SubmissionStatus.SUBMITTED)
    })

    it('should return 400 when assignment already submitted', async () => {
      await assignmentSubmissionModel.create({
        assignmentId,
        learnerId: mockLearnerId,
        classId: testClass._id,
        attachments: [],
        status: SubmissionStatus.SUBMITTED
      })

      await request(global.app.getHttpServer())
        .post(`/classes/learner/${testClass._id}/submit-assignment`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .send({
          assignmentId,
          attachments: []
        })
        .expect(400)
    })

    it('should return 400 when assignment deadline passed', async () => {
      await classModel.updateOne(
        { 'sessions.assignments._id': assignmentId },
        {
          $set: {
            'sessions.$.assignments.$[assignment].deadline': faker.date.past()
          }
        },
        {
          arrayFilters: [{ 'assignment._id': assignmentId }]
        }
      )

      await request(global.app.getHttpServer())
        .post(`/classes/learner/${testClass._id}/submit-assignment`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .send({
          assignmentId,
          attachments: []
        })
        .expect(400)
    })
  })
})
