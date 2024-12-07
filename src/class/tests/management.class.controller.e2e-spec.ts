import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import {
  UserRole,
  StaffStatus,
  CourseStatus,
  ClassStatus,
  SlotNumber,
  Weekday,
  CourseLevel,
  SubmissionStatus
} from '@common/contracts/constant'
import { Class } from '@class/schemas/class.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Staff } from '@staff/schemas/staff.schema'
import { Course } from '@course/schemas/course.schema'
import { Garden } from '@garden/schemas/garden.schema'
import { MediaResourceType, MediaType } from '@media/contracts/constant'
import { AssignmentSubmission } from '@class/schemas/assignment-submission.schema'
import { LearnerClass } from '@class/schemas/learner-class.schema'
import { Session } from '@class/schemas/session.schema'
import { Assignment } from '@class/schemas/assignment.schema'
import * as moment from 'moment-timezone'
import { VN_TIMEZONE } from '@src/config'

describe('ManagementClassController (e2e)', () => {
  let classModel: Model<Class>
  let staffModel: Model<Staff>
  let courseModel: Model<Course>
  let gardenModel: Model<Garden>
  let assignmentSubmissionModel: Model<AssignmentSubmission>
  let learnerClassModel: Model<LearnerClass>
  let jwtService: JwtService
  let configService: ConfigService
  
  const mockStaffId = new Types.ObjectId()
  let staffAccessToken: string

  // Test data setup
  const testStaff = {
    _id: mockStaffId,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    status: StaffStatus.ACTIVE,
    role: UserRole.STAFF,
    idCardPhoto: faker.image.avatar(),
    staffCode: 'STAFF001'
  }

  const mockInstructorId = new Types.ObjectId()
  const mockLearnerId = new Types.ObjectId()

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
    status: ClassStatus.IN_PROGRESS,
    instructorId: mockInstructorId,
    courseId: new Types.ObjectId(),
    gardenId: new Types.ObjectId(),
    weekdays: [Weekday.MONDAY, Weekday.WEDNESDAY],
    slotNumbers: [SlotNumber.ONE],
    learnerLimit: 20,
    learnerQuantity: 0,
    sessions: [
      {
        _id: new Types.ObjectId(),
        sessionNumber: 1,
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        media: [{
          asset_id: faker.string.uuid(),
          public_id: faker.string.uuid(),
          resource_type: MediaResourceType.video,
          type: MediaType.upload,
          url: faker.internet.url()
        }],
        assignments: [{
          _id: new Types.ObjectId(),
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          attachments: [],
          deadline: moment().add(7, 'days').toDate()
        }]
      }
    ],
    progress: {
      total: 1,
      completed: 0,
      percentage: 0
    }
  }

  beforeAll(async () => {
    // Get models and services
    classModel = global.rootModule.get(getModelToken(Class.name))
    staffModel = global.rootModule.get(getModelToken(Staff.name))
    courseModel = global.rootModule.get(getModelToken(Course.name))
    gardenModel = global.rootModule.get(getModelToken(Garden.name))
    assignmentSubmissionModel = global.rootModule.get(getModelToken(AssignmentSubmission.name))
    learnerClassModel = global.rootModule.get(getModelToken(LearnerClass.name))
    jwtService = global.rootModule.get(JwtService)
    configService = global.rootModule.get(ConfigService)

    // Create staff access token
    staffAccessToken = jwtService.sign(
      {
        sub: mockStaffId.toString(),
        role: UserRole.STAFF
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    // Initialize test data
    await staffModel.create(testStaff)
    await classModel.create(testClass)
    await classModel.ensureIndexes()
  })

  afterAll(async () => {
    // Cleanup
    await classModel.deleteMany({})
    await staffModel.deleteMany({})
    await assignmentSubmissionModel.deleteMany({})
    await learnerClassModel.deleteMany({})
  })

  describe('GET /management', () => {
    it('should return class list successfully', async () => {
      const response = await request(global.app.getHttpServer())
        .get('/classes/management')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(response.body.data.docs).toBeInstanceOf(Array)
      expect(response.body.data.docs.length).toBeGreaterThan(0)
    })

    it('should filter classes by query parameters', async () => {
      const response = await request(global.app.getHttpServer())
        .get('/classes/management')
        .query({
          title: testClass.title,
          level: [CourseLevel.BASIC],
          status: [ClassStatus.IN_PROGRESS]
        })
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(response.body.data.docs[0].title).toBe(testClass.title)
    })
  })

  describe('GET /management/:id', () => {
    it('should return class detail successfully', async () => {
      const response = await request(global.app.getHttpServer())
        .get(`/classes/management/${testClass._id}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(response.body.data._id).toBe(testClass._id.toString())
    })

    it('should return 404 when class not found', async () => {
      await request(global.app.getHttpServer())
        .get(`/classes/management/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })
  })

  describe('PATCH /management/:id/complete', () => {
    it('should complete class successfully', async () => {
      // Set class end date to past
      const pastClass = {
        ...testClass,
        startDate: moment().subtract(2, 'weeks').toDate()
      }
      await classModel.findByIdAndUpdate(testClass._id, pastClass)

      const response = await request(global.app.getHttpServer())
        .patch(`/classes/management/${testClass._id}/complete`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(response.body.data.success).toBe(true)

      const updatedClass = await classModel.findById(testClass._id)
      expect(updatedClass.status).toBe(ClassStatus.COMPLETED)
    })

    it('should return 400 when class end time is invalid', async () => {
      const futureClass = {
        ...testClass,
        startDate: moment().add(1, 'week').toDate()
      }
      await classModel.findByIdAndUpdate(testClass._id, futureClass)

      await request(global.app.getHttpServer())
        .patch(`/classes/management/${testClass._id}/complete`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(400)
    })
  })

  describe('PATCH /management/:id/cancel', () => {
    it('should cancel class successfully', async () => {
      const response = await request(global.app.getHttpServer())
        .patch(`/classes/management/${testClass._id}/cancel`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({
          cancelReason: 'Test cancel reason'
        })
        .expect(200)

      expect(response.body.data.success).toBe(true)

      const updatedClass = await classModel.findById(testClass._id)
      expect(updatedClass.status).toBe(ClassStatus.CANCELED)
      expect(updatedClass.cancelReason).toBe('Test cancel reason')
    })

    it('should return 400 when class status is invalid', async () => {
      const completedClass = await classModel.create({
        ...testClass,
        _id: new Types.ObjectId(),
        status: ClassStatus.COMPLETED
      })

      await request(global.app.getHttpServer())
        .patch(`/classes/management/${completedClass._id}/cancel`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({
          cancelReason: 'Test cancel reason'
        })
        .expect(400)
    })
  })

  describe('GET /management/:classId/sessions/:sessionId', () => {
    it('should return session detail successfully', async () => {
      const response = await request(global.app.getHttpServer())
        .get(`/classes/management/${testClass._id}/sessions/${testClass.sessions[0]._id}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(response.body.data.sessionNumber).toBe(testClass.sessions[0].sessionNumber)
    })

    it('should return 404 when session not found', async () => {
      await request(global.app.getHttpServer())
        .get(`/classes/management/${testClass._id}/sessions/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })
  })

  describe('GET /management/:classId/assignments/:assignmentId', () => {
    it('should return assignment detail successfully', async () => {
      const response = await request(global.app.getHttpServer())
        .get(`/classes/management/${testClass._id}/assignments/${testClass.sessions[0].assignments[0]._id}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(response.body.data.title).toBe(testClass.sessions[0].assignments[0].title)
    })

    it('should return 404 when assignment not found', async () => {
      await request(global.app.getHttpServer())
        .get(`/classes/management/${testClass._id}/assignments/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })
  })
})
