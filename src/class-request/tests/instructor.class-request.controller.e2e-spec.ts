import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import {
  UserRole,
  ClassRequestStatus,
  ClassRequestType,
  InstructorStatus,
  CourseStatus,
  ClassStatus,
  SlotNumber,
  Weekday,
  CourseLevel
} from '@common/contracts/constant'
import { ClassRequest } from '@class-request/schemas/class-request.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { Course } from '@course/schemas/course.schema'
import { Class } from '@class/schemas/class.schema'
import { Setting } from '@setting/schemas/setting.schema'
import { SettingKey } from '@setting/contracts/constant'
import { MediaResourceType, MediaType } from '@media/contracts/constant'
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service'

describe('InstructorClassRequestController (e2e)', () => {
  let classRequestModel: Model<ClassRequest>
  let instructorModel: Model<Instructor>
  let courseModel: Model<Course>
  let classModel: Model<Class>
  let settingModel: Model<Setting>
  let jwtService: JwtService
  let configService: ConfigService
  let gardenTimesheetService: IGardenTimesheetService
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
    instructorId: mockInstructorId,
    sessions: [
      {
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
        ]
      },
      {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        sessionNumber: 2,
        media: [
          {
            asset_id: faker.string.uuid(),
            public_id: faker.string.uuid(),
            resource_type: MediaResourceType.video,
            type: MediaType.upload,
            url: faker.internet.url()
          }
        ]
      }
    ],
    learnerLimit: 20,
    childCourseIds: [],
    gardenRequiredToolkits: faker.lorem.sentence()
  }

  const testClass = {
    _id: new Types.ObjectId(),
    code: 'ORCHID001',
    title: faker.lorem.words(3),
    status: ClassStatus.PUBLISHED,
    instructorId: mockInstructorId,
    courseId: testCourse._id,
    progress: {
      total: 2,
      completed: 0,
      percentage: 0
    },
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
    sessions: [
      {
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
        ]
      },
      {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        sessionNumber: 2,
        media: [
          {
            asset_id: faker.string.uuid(),
            public_id: faker.string.uuid(),
            resource_type: MediaResourceType.video,
            type: MediaType.upload,
            url: faker.internet.url()
          }
        ]
      }
    ],
    learnerLimit: 20,
    childCourseIds: [],
    gardenRequiredToolkits: faker.lorem.sentence()
  }

  beforeAll(async () => {
    classRequestModel = global.rootModule.get(getModelToken(ClassRequest.name))
    instructorModel = global.rootModule.get(getModelToken(Instructor.name))
    courseModel = global.rootModule.get(getModelToken(Course.name))
    classModel = global.rootModule.get(getModelToken(Class.name))
    settingModel = global.rootModule.get(getModelToken(Setting.name))
    jwtService = global.rootModule.get(JwtService)
    configService = global.rootModule.get(ConfigService)
    gardenTimesheetService = global.rootModule.get(IGardenTimesheetService)

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
    await settingModel.create([
      {
        key: SettingKey.CreateClassRequestLimitPerDay,
        value: '10'
      },
      {
        key: SettingKey.ClassRequestAutoExpiration,
        value: '2'
      }
    ])

    jest.spyOn(gardenTimesheetService, 'viewAvailableTime').mockResolvedValue({
      slotNumbers: [SlotNumber.ONE, SlotNumber.TWO, SlotNumber.THREE, SlotNumber.FOUR]
    })
  })

  afterAll(async () => {
    await classRequestModel.deleteMany({})
    await instructorModel.deleteMany({})
    await courseModel.deleteMany({})
    await classModel.deleteMany({})
    await settingModel.deleteMany({})

    jest.clearAllMocks()
  })

  describe('GET /class-requests/instructor', () => {
    it('should return class request list', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/class-requests/instructor')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
    })

    it('should filter by type and status', async () => {
      const {
        body: { data }
      } = await request(global.app.getHttpServer())
        .get('/class-requests/instructor')
        .query({
          type: [ClassRequestType.PUBLISH_CLASS],
          status: [ClassRequestStatus.PENDING]
        })
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(data.docs).toBeInstanceOf(Array)
    })
  })

  describe('POST /class-requests/instructor/publish-class', () => {
    const createPublishRequest = {
      courseId: testCourse._id,
      description: faker.lorem.paragraph(),
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      weekdays: [Weekday.MONDAY, Weekday.THURSDAY],
      slotNumbers: [SlotNumber.ONE]
    }

    it('should create publish class request successfully', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/class-requests/instructor/publish-class')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send(createPublishRequest)
        .expect(201)

      expect(status).toBe(201)
      expect(body.data._id).toBeDefined()
    })

    it('should return 400 when course not found', async () => {
      await request(global.app.getHttpServer())
        .post('/class-requests/instructor/publish-class')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send({
          ...createPublishRequest,
          courseId: new Types.ObjectId()
        })
        .expect(404)
    })

    it('should return 400 when weekdays invalid', async () => {
      await request(global.app.getHttpServer())
        .post('/class-requests/instructor/publish-class')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send({
          ...createPublishRequest,
          weekdays: [Weekday.MONDAY, Weekday.MONDAY]
        })
        .expect(422)
    })
  })

  describe('POST /class-requests/instructor/cancel-class', () => {
    const createCancelRequest = {
      classId: testClass._id,
      description: faker.lorem.paragraph()
    }

    it('should create cancel class request successfully', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .post('/class-requests/instructor/cancel-class')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send(createCancelRequest)
        .expect(201)

      expect(status).toBe(201)
      expect(body.data._id).toBeDefined()
    })

    it('should return 400 when class not found', async () => {
      await request(global.app.getHttpServer())
        .post('/class-requests/instructor/cancel-class')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send({
          ...createCancelRequest,
          classId: new Types.ObjectId()
        })
        .expect(404)
    })
  })

  describe('PATCH /class-requests/instructor/:id/cancel', () => {
    let pendingClassRequest: ClassRequest

    beforeEach(async () => {
      pendingClassRequest = await classRequestModel.create({
        type: ClassRequestType.PUBLISH_CLASS,
        status: ClassRequestStatus.PENDING,
        description: faker.lorem.paragraph(),
        courseId: testCourse._id,
        createdBy: mockInstructorId
      })
    })

    it('should cancel class request successfully', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .patch(`/class-requests/instructor/${pendingClassRequest._id}/cancel`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(body.data.success).toBe(true)

      const updatedRequest = await classRequestModel.findById(pendingClassRequest._id)
      expect(updatedRequest.status).toBe(ClassRequestStatus.CANCELED)
    })

    it('should return 404 when class request not found', async () => {
      await request(global.app.getHttpServer())
        .patch(`/class-requests/instructor/${new Types.ObjectId()}/cancel`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(404)
    })

    it('should return 400 when class request not in pending status', async () => {
      const canceledRequest = await classRequestModel.create({
        type: ClassRequestType.PUBLISH_CLASS,
        status: ClassRequestStatus.CANCELED,
        description: faker.lorem.paragraph(),
        courseId: testCourse._id,
        createdBy: mockInstructorId
      })

      await request(global.app.getHttpServer())
        .patch(`/class-requests/instructor/${canceledRequest._id}/cancel`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(400)
    })
  })

  describe('GET /class-requests/instructor/:id', () => {
    let classRequest: ClassRequest

    beforeEach(async () => {
      classRequest = await classRequestModel.create({
        type: ClassRequestType.PUBLISH_CLASS,
        status: ClassRequestStatus.PENDING,
        description: faker.lorem.paragraph(),
        courseId: testCourse._id,
        createdBy: mockInstructorId
      })
    })

    it('should return class request detail', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .get(`/class-requests/instructor/${classRequest._id}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(body.data._id).toBe(classRequest._id.toString())
      expect(body.data.type).toBe(classRequest.type)
      expect(body.data.status).toBe(classRequest.status)
    })

    it('should return 404 when class request not found', async () => {
      await request(global.app.getHttpServer())
        .get(`/class-requests/instructor/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(404)
    })
  })
})
