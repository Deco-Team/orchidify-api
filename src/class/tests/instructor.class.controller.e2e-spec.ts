import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import {
  UserRole,
  ClassStatus,
  InstructorStatus,
  CourseStatus,
  SlotNumber,
  Weekday,
  CourseLevel,
  SubmissionStatus
} from '@common/contracts/constant'
import { Class } from '@class/schemas/class.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { Course } from '@course/schemas/course.schema'
import { MediaResourceType, MediaType } from '@media/contracts/constant'
import { AssignmentSubmission } from '@class/schemas/assignment-submission.schema'
import { LearnerClass } from '@class/schemas/learner-class.schema'
import * as moment from 'moment-timezone'
import { VN_TIMEZONE } from '@src/config'

describe('InstructorClassController (e2e)', () => {
  let classModel: Model<Class>
  let instructorModel: Model<Instructor>
  let courseModel: Model<Course>
  let assignmentSubmissionModel: Model<AssignmentSubmission>
  let learnerClassModel: Model<LearnerClass>
  let jwtService: JwtService
  let configService: ConfigService

  const mockInstructorId = new Types.ObjectId()
  let instructorAccessToken: string

  const testInstructor = {
    _id: mockInstructorId,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    status: InstructorStatus.ACTIVE,
    idCardPhoto: faker.image.avatar(),
    phone: faker.phone.number(),
    dateOfBirth: faker.date.past()
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
    status: ClassStatus.IN_PROGRESS,
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
    instructorModel = global.rootModule.get(getModelToken(Instructor.name))
    courseModel = global.rootModule.get(getModelToken(Course.name))
    assignmentSubmissionModel = global.rootModule.get(getModelToken(AssignmentSubmission.name))
    learnerClassModel = global.rootModule.get(getModelToken(LearnerClass.name))
    jwtService = global.rootModule.get(JwtService)
    configService = global.rootModule.get(ConfigService)

    instructorAccessToken = jwtService.sign(
      {
        sub: mockInstructorId.toString(),
        role: UserRole.INSTRUCTOR
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    await instructorModel.create(testInstructor)
    await courseModel.create(testCourse)
    await classModel.create(testClass)
  })

  afterAll(async () => {
    await classModel.deleteMany({})
    await instructorModel.deleteMany({})
    await courseModel.deleteMany({})
    await assignmentSubmissionModel.deleteMany({})
    await learnerClassModel.deleteMany({})
  })

  describe('GET /classes/instructor', () => {
    it('should return class list successfully', async () => {
      const response = await request(global.app.getHttpServer())
        .get('/classes/instructor')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(response.body.data.docs).toBeInstanceOf(Array)
      expect(response.body.data.docs.length).toBeGreaterThan(0)
    })

    it('should filter classes by title', async () => {
      const response = await request(global.app.getHttpServer())
        .get('/classes/instructor')
        .query({ title: testClass.title })
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(response.body.data.docs[0].title).toBe(testClass.title)
    })
  })

  describe('GET /classes/instructor/:id', () => {
    it('should return class detail successfully', async () => {
      const response = await request(global.app.getHttpServer())
        .get(`/classes/instructor/${testClass._id}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(response.body.data._id).toBe(testClass._id.toString())
    })

    it('should return 404 when class not found', async () => {
      await request(global.app.getHttpServer())
        .get(`/classes/instructor/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(404)
    })
  })

  describe('GET /classes/instructor/:classId/sessions/:sessionId', () => {
    it('should return session detail successfully', async () => {
      const sessionId = testClass.sessions[0]._id

      const response = await request(global.app.getHttpServer())
        .get(`/classes/instructor/${testClass._id}/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(response.body.data._id).toBe(sessionId.toString())
    })

    it('should return 404 when session not found', async () => {
      await request(global.app.getHttpServer())
        .get(`/classes/instructor/${testClass._id}/sessions/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(404)
    })
  })

  describe('PATCH /classes/instructor/:classId/sessions/:sessionId/upload-resources', () => {
    it('should upload session resources successfully', async () => {
      const sessionId = testClass.sessions[0]._id
      const newMedia = {
        asset_id: faker.string.uuid(),
        public_id: faker.string.uuid(),
        resource_type: MediaResourceType.video,
        type: MediaType.upload,
        url: faker.internet.url()
      }

      await request(global.app.getHttpServer())
        .patch(`/classes/instructor/${testClass._id}/sessions/${sessionId}/upload-resources`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send({
          media: [newMedia]
        })
        .expect(200)

      const updatedClass = await classModel.findById(testClass._id, '+sessions')
      const updatedSession = updatedClass.sessions.find((s) => s._id.toString() === sessionId.toString())
      expect(updatedSession.media.length).toBe(testClass.sessions[0].media.length + 1)
    })

    it('should return 400 when class not in progress', async () => {
      const completedClass = await classModel.create({
        ...testClass,
        _id: new Types.ObjectId(),
        status: ClassStatus.COMPLETED
      })

      await request(global.app.getHttpServer())
        .patch(`/classes/instructor/${completedClass._id}/sessions/${completedClass.sessions[0]._id}/upload-resources`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send({
          media: [
            {
              asset_id: faker.string.uuid(),
              public_id: faker.string.uuid(),
              resource_type: MediaResourceType.video,
              type: MediaType.upload,
              url: faker.internet.url()
            }
          ]
        })
        .expect(400)
    })
  })

  describe('GET /classes/instructor/:classId/assignments/:assignmentId', () => {
    it('should return assignment detail successfully', async () => {
      const assignmentId = testClass.sessions[0].assignments[0]._id

      const response = await request(global.app.getHttpServer())
        .get(`/classes/instructor/${testClass._id}/assignments/${assignmentId}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(response.body.data._id).toBe(assignmentId.toString())
    })
  })

  describe('PATCH /classes/instructor/:classId/assignments/:assignmentId', () => {
    it('should update assignment deadline successfully', async () => {
      const assignmentId = testClass.sessions[0].assignments[0]._id
      const { startDate, duration, weekdays } = testClass
      const startOfDate = moment(startDate).tz(VN_TIMEZONE).startOf('date')
      const endOfDate = startOfDate.clone().add(duration, 'week').startOf('date')

      const classDates = [] as Date[]
      let currentDate = startOfDate.clone()
      while (currentDate.isSameOrBefore(endOfDate)) {
        for (let weekday of weekdays) {
          const classDate = currentDate.clone().isoWeekday(weekday)
          if (classDate.isSameOrAfter(startOfDate) && classDate.isBefore(endOfDate)) {
            classDates.push(classDate.toDate())
          }
        }
        currentDate.add(1, 'week')
      }
      const classEndOfDate = moment(classDates[classDates.length - 1])
        .tz(VN_TIMEZONE)
        .endOf('date')

      await request(global.app.getHttpServer())
        .patch(`/classes/instructor/${testClass._id}/assignments/${assignmentId}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send({
          deadline: classEndOfDate.toDate()
        })
        .expect(200)
    })
  })

  describe('POST /classes/instructor/:classId/assignment-submissions/:submissionId/grade', () => {
    let submission: AssignmentSubmission

    beforeEach(async () => {
      submission = await assignmentSubmissionModel.create({
        assignmentId: testClass.sessions[0].assignments[0]._id,
        classId: testClass._id,
        learnerId: new Types.ObjectId(),
        attachments: [],
        status: SubmissionStatus.SUBMITTED
      })
    })

    it('should grade assignment submission successfully', async () => {
      await request(global.app.getHttpServer())
        .post(`/classes/instructor/${testClass._id}/assignment-submissions/${submission._id}/grade`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send({
          point: 8,
          feedback: faker.lorem.sentence()
        })
        .expect(201)

      const updatedSubmission = await assignmentSubmissionModel.findById(submission._id)
      expect(updatedSubmission.status).toBe(SubmissionStatus.GRADED)
    })

    it('should return 400 when submission already graded', async () => {
      const gradedSubmission = await assignmentSubmissionModel.create({
        assignmentId: testClass.sessions[0].assignments[0]._id,
        classId: testClass._id,
        learnerId: new Types.ObjectId(),
        attachments: [],
        status: SubmissionStatus.GRADED,
        point: 9
      })

      await request(global.app.getHttpServer())
        .post(`/classes/instructor/${testClass._id}/assignment-submissions/${gradedSubmission._id}/grade`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send({
          point: 8,
          feedback: faker.lorem.sentence()
        })
        .expect(400)
    })
  })
})
