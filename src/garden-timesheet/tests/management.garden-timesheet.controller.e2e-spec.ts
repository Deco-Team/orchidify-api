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
  CourseLevel,
  ClassStatus
} from '@common/contracts/constant'
import { GardenTimesheet } from '@garden-timesheet/schemas/garden-timesheet.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Garden } from '@garden/schemas/garden.schema'
import { Class } from '@class/schemas/class.schema'
import * as moment from 'moment-timezone'
import { VN_TIMEZONE } from '@src/config'
import { MediaResourceType, MediaType } from '@media/contracts/constant'

describe('ManagementGardenTimesheetController (e2e)', () => {
  let gardenTimesheetModel: Model<GardenTimesheet>
  let gardenModel: Model<Garden>
  let classModel: Model<Class>
  let jwtService: JwtService
  let configService: ConfigService

  const mockStaffId = new Types.ObjectId()
  const mockGardenManagerId = new Types.ObjectId()
  let staffAccessToken: string
  let gardenManagerAccessToken: string

  const testGarden = {
    _id: new Types.ObjectId(),
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    status: GardenStatus.ACTIVE,
    gardenManagerId: mockGardenManagerId,
    addressLink: faker.internet.url(),
    description: faker.lorem.paragraph(),
    maxClass: faker.number.int({ min: 1, max: 10 })
  }

  const testClass = {
    _id: new Types.ObjectId(),
    code: 'TEST001',
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
      }
    ],
    learnerLimit: 20,
    childCourseIds: [],
    gardenRequiredToolkits: faker.lorem.sentence()
  }

  beforeAll(async () => {
    gardenTimesheetModel = global.rootModule.get(getModelToken(GardenTimesheet.name))
    gardenModel = global.rootModule.get(getModelToken(Garden.name))
    classModel = global.rootModule.get(getModelToken(Class.name))
    jwtService = global.rootModule.get(JwtService)
    configService = global.rootModule.get(ConfigService)

    staffAccessToken = jwtService.sign(
      {
        sub: mockStaffId.toString(),
        role: UserRole.STAFF
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    gardenManagerAccessToken = jwtService.sign(
      {
        sub: mockGardenManagerId.toString(),
        role: UserRole.GARDEN_MANAGER
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    await gardenModel.create(testGarden)
    await classModel.create(testClass)
  })

  afterAll(async () => {
    await gardenTimesheetModel.deleteMany({})
    await gardenModel.deleteMany({})
    await classModel.deleteMany({})
  })

  describe('GET /garden-timesheets/management', () => {
    const date = faker.date.future()

    beforeAll(async () => {
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
    })

    afterAll(async () => {
      await gardenTimesheetModel.deleteMany({})
    })

    it('should return garden timesheet list successfully for staff', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/garden-timesheets/management')
        .query({
          date: date,
          type: TimesheetType.DAY,
          gardenId: testGarden._id.toString()
        })
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
      expect(data.docs.length).toBeGreaterThan(0)
    })

    it('should return garden timesheet list successfully for garden manager', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/garden-timesheets/management')
        .query({
          date: date,
          type: TimesheetType.DAY,
          gardenId: testGarden._id.toString()
        })
        .set('Authorization', `Bearer ${gardenManagerAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
      expect(data.docs.length).toBeGreaterThan(0)
    })

    it('should return 404 when garden not found', async () => {
      await request(global.app.getHttpServer())
        .get('/garden-timesheets/management')
        .query({
          date: date,
          type: TimesheetType.DAY,
          gardenId: new Types.ObjectId().toString()
        })
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })

    it('should return 422 when type is invalid', async () => {
      await request(global.app.getHttpServer())
        .get('/garden-timesheets/management')
        .query({
          date: date,
          type: 'INVALID_TYPE',
          gardenId: testGarden._id.toString()
        })
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(422)
    })
  })

  describe('PUT /garden-timesheets/management', () => {
    const date = moment().tz(VN_TIMEZONE).add(8, 'days').startOf('date').toDate()

    beforeAll(async () => {
      await gardenTimesheetModel.create({
        date,
        status: GardenTimesheetStatus.ACTIVE,
        gardenId: testGarden._id,
        gardenMaxClass: testGarden.maxClass,
        slots: []
      })
    })

    afterAll(async () => {
      await gardenTimesheetModel.deleteMany({})
    })

    it('should update garden timesheet status successfully', async () => {
      await request(global.app.getHttpServer())
        .put('/garden-timesheets/management')
        .send({
          date: date,
          gardenId: testGarden._id.toString(),
          status: GardenTimesheetStatus.INACTIVE
        })
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      const updatedTimesheet = await gardenTimesheetModel.findOne({
        date,
        gardenId: testGarden._id
      })
      expect(updatedTimesheet.status).toBe(GardenTimesheetStatus.INACTIVE)
    })

    it('should return 404 when garden timesheet not found', async () => {
      await request(global.app.getHttpServer())
        .put('/garden-timesheets/management')
        .send({
          date: moment().add(1, 'year').toDate(),
          gardenId: testGarden._id.toString(),
          status: GardenTimesheetStatus.INACTIVE
        })
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })

    it('should return 400 when trying to update timesheet with slots', async () => {
      const timesheetWithSlots = await gardenTimesheetModel.create({
        date: moment().add(9, 'days').startOf('date').toDate(),
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
            classId: testClass._id
          }
        ]
      })

      await request(global.app.getHttpServer())
        .put('/garden-timesheets/management')
        .send({
          date: timesheetWithSlots.date,
          gardenId: testGarden._id.toString(),
          status: GardenTimesheetStatus.INACTIVE
        })
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(400)
    })
  })

  describe('GET /garden-timesheets/management/garden-manager/slots', () => {
    const date = faker.date.future()

    beforeAll(async () => {
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
            classId: testClass._id
          }
        ]
      })
    })

    afterAll(async () => {
      await gardenTimesheetModel.deleteMany({})
    })

    it('should return slot list successfully for garden manager', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/garden-timesheets/management/garden-manager/slots')
        .query({
          date: date
        })
        .set('Authorization', `Bearer ${gardenManagerAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
      expect(data.docs.length).toBeGreaterThan(0)
    })

    it('should return empty array when no slots found', async () => {
      const futureDate = moment().add(1, 'year').toDate()

      const {
        body: { data }
      } = await request(global.app.getHttpServer())
        .get('/garden-timesheets/management/garden-manager/slots')
        .query({
          date: futureDate
        })
        .set('Authorization', `Bearer ${gardenManagerAccessToken}`)
        .expect(200)

      expect(data.docs).toBeInstanceOf(Array)
      expect(data.docs).toHaveLength(0)
    })
  })

  describe('GET /garden-timesheets/management/garden-manager/slots/:slotId', () => {
    const date = faker.date.future()
    let testSlotId: Types.ObjectId

    beforeAll(async () => {
      testSlotId = new Types.ObjectId()
      await gardenTimesheetModel.create({
        date,
        status: GardenTimesheetStatus.ACTIVE,
        gardenId: testGarden._id,
        gardenMaxClass: testGarden.maxClass,
        slots: [
          {
            _id: testSlotId,
            slotNumber: SlotNumber.ONE,
            start: moment(date).add(7, 'hour').toDate(),
            end: moment(date).add(9, 'hour').toDate(),
            status: SlotStatus.NOT_AVAILABLE,
            classId: testClass._id
          }
        ]
      })
    })

    afterAll(async () => {
      await gardenTimesheetModel.deleteMany({})
    })

    it('should return slot detail successfully', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/garden-timesheets/management/garden-manager/slots/${testSlotId.toString()}`)
        .set('Authorization', `Bearer ${gardenManagerAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(testSlotId.toString())
      expect(data.slotNumber).toBe(SlotNumber.ONE)
      expect(data.status).toBe(SlotStatus.NOT_AVAILABLE)
    })

    it('should return 404 when slot not found', async () => {
      await request(global.app.getHttpServer())
        .get(`/garden-timesheets/management/garden-manager/slots/${new Types.ObjectId().toString()}`)
        .set('Authorization', `Bearer ${gardenManagerAccessToken}`)
        .expect(404)
    })
  })
})
