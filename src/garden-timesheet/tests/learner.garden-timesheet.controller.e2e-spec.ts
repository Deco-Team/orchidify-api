import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import {
  UserRole,
  TimesheetType,
  SlotNumber,
  SlotStatus,
  GardenTimesheetStatus,
  GardenStatus,
  AttendanceStatus,
  CourseLevel,
  ClassStatus
} from '@common/contracts/constant'
import { GardenTimesheet } from '@garden-timesheet/schemas/garden-timesheet.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Learner } from '@learner/schemas/learner.schema'
import { Garden } from '@garden/schemas/garden.schema'
import { Class } from '@class/schemas/class.schema'
import { Attendance } from '@attendance/schemas/attendance.schema'
import * as moment from 'moment-timezone'
import { VN_TIMEZONE } from '@src/config'
import { MediaResourceType, MediaType } from '@media/contracts/constant'
import { LearnerClass, LearnerClassDocument } from '@class/schemas/learner-class.schema'

describe('LearnerGardenTimesheetController (e2e)', () => {
  let gardenTimesheetModel: Model<GardenTimesheet>
  let learnerModel: Model<Learner>
  let gardenModel: Model<Garden>
  let classModel: Model<Class>
  let attendanceModel: Model<Attendance>
  let learnerClassModel: Model<LearnerClassDocument>
  let jwtService: JwtService
  let configService: ConfigService

  const mockLearnerId = new Types.ObjectId()
  let learnerAccessToken: string

  const testLearner = {
    _id: mockLearnerId,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    phone: faker.phone.number(),
    avatar: faker.image.avatar(),
    role: UserRole.LEARNER
  }

  const testGarden = {
    _id: new Types.ObjectId(),
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    status: 'ACTIVE',
    gardenManagerId: new Types.ObjectId(),
    addressLink: faker.internet.url(),
    description: faker.lorem.paragraph(),
    maxClass: faker.number.int(10)
  }

  const testClass = {
    _id: new Types.ObjectId(),
    code: 'ORCHID001',
    title: faker.lorem.words(3),
    status: ClassStatus.PUBLISHED,
    instructorId: new Types.ObjectId(),
    courseId: new Types.ObjectId(),
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

  let learnerClassTestData = [
    {
      _id: new Types.ObjectId(),
      enrollDate: new Date(),
      transactionId: new Types.ObjectId(),
      learnerId: testLearner._id,
      classId: testClass._id,
      courseId: new Types.ObjectId()
    }
  ]

  beforeAll(async () => {
    gardenTimesheetModel = global.rootModule.get(getModelToken(GardenTimesheet.name))
    learnerModel = global.rootModule.get(getModelToken(Learner.name))
    gardenModel = global.rootModule.get(getModelToken(Garden.name))
    classModel = global.rootModule.get(getModelToken(Class.name))
    attendanceModel = global.rootModule.get(getModelToken(Attendance.name))
    learnerClassModel = global.rootModule.get(getModelToken(LearnerClass.name))
    jwtService = global.rootModule.get(JwtService)
    configService = global.rootModule.get(ConfigService)

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
    await gardenModel.create(testGarden)
    await classModel.create(testClass)
    await learnerClassModel.create(learnerClassTestData)
  })

  afterAll(async () => {
    await gardenTimesheetModel.deleteMany({})
    await learnerModel.deleteMany({})
    await gardenModel.deleteMany({})
    await classModel.deleteMany({})
    await attendanceModel.deleteMany({})
  })

  describe('GET /garden-timesheets/learner/my-timesheet', () => {
    const date = moment().tz(VN_TIMEZONE).startOf('date').toDate()

    beforeAll(async () => {
      // Create test garden timesheet
      await gardenTimesheetModel.create({
        date,
        status: GardenTimesheetStatus.ACTIVE,
        gardenId: testGarden._id,
        gardenMaxClass: testGarden.maxClass,
        slots: [
          {
            _id: new Types.ObjectId(),
            slotNumber: SlotNumber.ONE,
            start: moment(date).add(7, 'hour').toDate(),
            end: moment(date).add(9, 'hour').toDate(),
            status: SlotStatus.NOT_AVAILABLE,
            classId: testClass._id,
            metadata: {
              code: testClass.code,
              title: testClass.title,
              sessionNumber: 1,
              sessionTitle: 'Session 1'
            }
          }
        ]
      })

      // Create test attendance
      await attendanceModel.create({
        slotId: new Types.ObjectId(),
        learnerId: mockLearnerId,
        status: AttendanceStatus.PRESENT,
        classId: testClass._id
      })
    })

    it('should return my timesheet list successfully', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/garden-timesheets/learner/my-timesheet')
        .query({
          date: date,
          type: TimesheetType.MONTH
        })
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
      expect(data.docs.length).toBeGreaterThan(0)

      const timesheet = data.docs[0]
      expect(timesheet).toHaveProperty('slotNumber')
      expect(timesheet).toHaveProperty('start')
      expect(timesheet).toHaveProperty('end')
      expect(timesheet).toHaveProperty('status')
      expect(timesheet).toHaveProperty('metadata')
      expect(timesheet).toHaveProperty('garden')
      expect(timesheet).toHaveProperty('attendance')
    })

    it('should return 400 when type is invalid', async () => {
      await request(global.app.getHttpServer())
        .get('/garden-timesheets/learner/my-timesheet')
        .query({
          date: date,
          type: 'INVALID_TYPE'
        })
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(422)
    })

    it('should return empty array when no timesheet found', async () => {
      const futureDate = moment().add(1, 'year').toDate()

      const {
        body: { data }
      } = await request(global.app.getHttpServer())
        .get('/garden-timesheets/learner/my-timesheet')
        .query({
          date: futureDate,
          type: TimesheetType.MONTH
        })
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(200)

      expect(data.docs).toBeInstanceOf(Array)
      expect(data.docs).toHaveLength(0)
    })
  })
})
