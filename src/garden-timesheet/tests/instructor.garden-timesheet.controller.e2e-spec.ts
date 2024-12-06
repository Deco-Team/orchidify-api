import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import {
  UserRole,
  GardenTimesheetStatus,
  SlotStatus,
  SlotNumber,
  TimesheetType,
  Weekday,
  InstructorStatus,
  CourseLevel,
  ClassStatus
} from '@common/contracts/constant'
import { GardenTimesheet } from '@garden-timesheet/schemas/garden-timesheet.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { Garden } from '@garden/schemas/garden.schema'
import { Class } from '@class/schemas/class.schema'
import { MediaResourceType, MediaType } from '@media/contracts/constant'
import * as moment from 'moment-timezone'
import { VN_TIMEZONE } from '@src/config'

describe('InstructorGardenTimesheetController (e2e)', () => {
  let gardenTimesheetModel: Model<GardenTimesheet>
  let instructorModel: Model<Instructor>
  let gardenModel: Model<Garden>
  let classModel: Model<Class>
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
    instructorId: mockInstructorId,
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

  beforeAll(async () => {
    gardenTimesheetModel = global.rootModule.get(getModelToken(GardenTimesheet.name))
    instructorModel = global.rootModule.get(getModelToken(Instructor.name))
    gardenModel = global.rootModule.get(getModelToken(Garden.name))
    classModel = global.rootModule.get(getModelToken(Class.name))
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
    await gardenModel.create(testGarden)
    await classModel.create(testClass)
  })

  afterAll(async () => {
    await gardenTimesheetModel.deleteMany({})
    await instructorModel.deleteMany({})
    await gardenModel.deleteMany({})
    await classModel.deleteMany({})
  })

  describe('GET /garden-timesheets/instructor/available-time', () => {
    it('should return available time slots successfully', async () => {
      const query = {
        startDate: moment.tz(VN_TIMEZONE).add(10, 'day').toDate(),
        duration: 4,
        weekdays: [Weekday.MONDAY, Weekday.THURSDAY]
      }

      const { body, status } = await request(global.app.getHttpServer())
        .get('/garden-timesheets/instructor/available-time')
        .query(query)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(body.data).toHaveProperty('slotNumbers')
      expect(body.data).toHaveProperty('availableTimeOfGardens')
    })

    it('should return 400 when weekdays are invalid', async () => {
      const query = {
        startDate: faker.date.future(),
        duration: 4,
        weekdays: [Weekday.MONDAY, Weekday.MONDAY] // Duplicate weekdays
      }

      await request(global.app.getHttpServer())
        .get('/garden-timesheets/instructor/available-time')
        .query(query)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(422)
    })
  })

  describe('GET /garden-timesheets/instructor/teaching-timesheet', () => {
    beforeEach(async () => {
      const timesheet = {
        date: new Date(),
        status: GardenTimesheetStatus.ACTIVE,
        gardenId: testGarden._id,
        gardenMaxClass: testGarden.maxClass,
        slots: [
          {
            _id: new Types.ObjectId(),
            slotNumber: SlotNumber.ONE,
            start: new Date(),
            end: new Date(),
            status: SlotStatus.NOT_AVAILABLE,
            instructorId: mockInstructorId,
            classId: testClass._id
          }
        ]
      }
      await gardenTimesheetModel.create(timesheet)
    })

    it('should return teaching timesheet list successfully', async () => {
      const query = {
        date: new Date(),
        type: TimesheetType.DAY
      }

      const { body, status } = await request(global.app.getHttpServer())
        .get('/garden-timesheets/instructor/teaching-timesheet')
        .query(query)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(body.data.docs).toBeInstanceOf(Array)
      expect(body.data.docs.length).toBeGreaterThan(0)
    })
  })

  describe('GET /garden-timesheets/instructor/slots/:slotId', () => {
    let testSlotId: Types.ObjectId

    beforeEach(async () => {
      testSlotId = new Types.ObjectId()
      const timesheet = {
        date: new Date(),
        status: GardenTimesheetStatus.ACTIVE,
        gardenId: testGarden._id,
        gardenMaxClass: testGarden.maxClass,
        slots: [
          {
            _id: testSlotId,
            slotNumber: SlotNumber.ONE,
            start: new Date(),
            end: new Date(),
            status: SlotStatus.NOT_AVAILABLE,
            instructorId: mockInstructorId,
            classId: testClass._id
          }
        ]
      }
      await gardenTimesheetModel.create(timesheet)
    })

    it('should return slot detail successfully', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/garden-timesheets/instructor/slots/${testSlotId}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(testSlotId.toString())
    })

    it('should return 404 when slot not found', async () => {
      await request(global.app.getHttpServer())
        .get(`/garden-timesheets/instructor/slots/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(404)
    })

    it('should return 404 when slot belongs to different instructor', async () => {
      const differentInstructorId = new Types.ObjectId()
      const timesheet = {
        date: new Date(),
        status: GardenTimesheetStatus.ACTIVE,
        gardenId: testGarden._id,
        gardenMaxClass: testGarden.maxClass,
        slots: [
          {
            _id: new Types.ObjectId(),
            slotNumber: SlotNumber.ONE,
            start: new Date(),
            end: new Date(),
            status: SlotStatus.NOT_AVAILABLE,
            instructorId: differentInstructorId,
            classId: testClass._id
          }
        ]
      }
      await gardenTimesheetModel.create(timesheet)

      await request(global.app.getHttpServer())
        .get(`/garden-timesheets/instructor/slots/${timesheet.slots[0]._id}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(404)
    })
  })
})
