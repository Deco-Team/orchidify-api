import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import {
  UserRole,
  ClassRequestStatus,
  ClassRequestType,
  StaffStatus,
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
import { Staff } from '@staff/schemas/staff.schema'
import { Course } from '@course/schemas/course.schema'
import { Class } from '@class/schemas/class.schema'
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service'
import { Garden } from '@garden/schemas/garden.schema'
import { MediaResourceType, MediaType } from '@media/contracts/constant'

describe('ManagementClassRequestController (e2e)', () => {
  let classRequestModel: Model<ClassRequest>
  let staffModel: Model<Staff>
  let courseModel: Model<Course>
  let classModel: Model<Class>
  let gardenModel: Model<Garden>
  let jwtService: JwtService
  let configService: ConfigService
  let gardenTimesheetService: IGardenTimesheetService
  const mockStaffId = new Types.ObjectId()
  let staffAccessToken: string

  const testStaff = {
    _id: mockStaffId,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    status: StaffStatus.ACTIVE,
    role: UserRole.STAFF,
    idCardPhoto: faker.image.avatar(),
    staffCode: 'staffCode'
  }

  const testGarden = {
    _id: new Types.ObjectId(),
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    status: 'ACTIVE',
    gardenManagerId: new Types.ObjectId(),
    addressLink: faker.internet.url(),
    description: faker.lorem.paragraph()
  }
  const mockInstructorId = new Types.ObjectId()
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
    staffModel = global.rootModule.get(getModelToken(Staff.name))
    courseModel = global.rootModule.get(getModelToken(Course.name))
    classModel = global.rootModule.get(getModelToken(Class.name))
    gardenModel = global.rootModule.get(getModelToken(Garden.name))
    jwtService = global.rootModule.get(JwtService)
    configService = global.rootModule.get(ConfigService)
    gardenTimesheetService = global.rootModule.get(IGardenTimesheetService)

    staffAccessToken = jwtService.sign(
      {
        sub: mockStaffId.toString(),
        role: UserRole.STAFF
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    await staffModel.create(testStaff)
    await courseModel.create(testCourse)
    await classModel.create(testClass)
    await gardenModel.create(testGarden)

    jest.spyOn(gardenTimesheetService, 'viewAvailableTime').mockResolvedValue({
      slotNumbers: [SlotNumber.ONE, SlotNumber.TWO],
      availableTimeOfGardens: [
        {
          gardenId: testGarden._id,
          slotNumbers: [SlotNumber.ONE, SlotNumber.TWO]
        }
      ]
    })
  })

  afterAll(async () => {
    await classRequestModel.deleteMany({})
    await staffModel.deleteMany({})
    await courseModel.deleteMany({})
    await classModel.deleteMany({})
    await gardenModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('GET /class-requests/management', () => {
    beforeEach(async () => {
      await classRequestModel.create([
        {
          type: ClassRequestType.PUBLISH_CLASS,
          status: ClassRequestStatus.PENDING,
          description: faker.lorem.paragraph(),
          courseId: testCourse._id,
          createdBy: new Types.ObjectId()
        },
        {
          type: ClassRequestType.CANCEL_CLASS,
          status: ClassRequestStatus.PENDING,
          description: faker.lorem.paragraph(),
          classId: testClass._id,
          createdBy: new Types.ObjectId()
        }
      ])
    })

    it('should return class request list', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/class-requests/management')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
      expect(data.docs.length).toBeGreaterThan(0)
    })

    it('should filter by type and status', async () => {
      const {
        body: { data }
      } = await request(global.app.getHttpServer())
        .get('/class-requests/management')
        .query({
          type: [ClassRequestType.PUBLISH_CLASS],
          status: [ClassRequestStatus.PENDING]
        })
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(data.docs.every((doc) => doc.type === ClassRequestType.PUBLISH_CLASS)).toBe(true)
      expect(data.docs.every((doc) => doc.status === ClassRequestStatus.PENDING)).toBe(true)
    })
  })

  describe('GET /class-requests/management/:id', () => {
    let classRequest: ClassRequest

    beforeEach(async () => {
      classRequest = await classRequestModel.create({
        type: ClassRequestType.PUBLISH_CLASS,
        status: ClassRequestStatus.PENDING,
        description: faker.lorem.paragraph(),
        courseId: testCourse._id,
        createdBy: new Types.ObjectId()
      })
    })

    it('should return class request detail', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .get(`/class-requests/management/${classRequest._id}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(body.data._id).toBe(classRequest._id.toString())
    })

    it('should return 404 when class request not found', async () => {
      await request(global.app.getHttpServer())
        .get(`/class-requests/management/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })
  })

  describe('PATCH /class-requests/management/:id/approve', () => {
    describe('Publish Class Request', () => {
      let publishClassRequest: ClassRequest

      beforeEach(async () => {
        publishClassRequest = await classRequestModel.create({
          type: ClassRequestType.PUBLISH_CLASS,
          status: ClassRequestStatus.PENDING,
          description: faker.lorem.paragraph(),
          courseId: testCourse._id,
          createdBy: new Types.ObjectId(),
          metadata: {
            ...testCourse,
            startDate: new Date(),
            weekdays: [Weekday.MONDAY, Weekday.THURSDAY],
            slotNumbers: [SlotNumber.ONE],
          }
        })
      })

      it('should approve publish class request successfully', async () => {
        const { body, status } = await request(global.app.getHttpServer())
          .patch(`/class-requests/management/${publishClassRequest._id}/approve`)
          .set('Authorization', `Bearer ${staffAccessToken}`)
          .send({ gardenId: testGarden._id })
          .expect(200)

        expect(status).toBe(200)
        expect(body.data.success).toBe(true)

        const updatedRequest = await classRequestModel.findById(publishClassRequest._id)
        expect(updatedRequest.status).toBe(ClassRequestStatus.APPROVED)
      })

      it('should return 400 when garden not available', async () => {
        await request(global.app.getHttpServer())
          .patch(`/class-requests/management/${publishClassRequest._id}/approve`)
          .set('Authorization', `Bearer ${staffAccessToken}`)
          .send({ gardenId: new Types.ObjectId() })
          .expect(400)
      })
    })

    describe('Cancel Class Request', () => {
      let cancelClassRequest: ClassRequest

      beforeEach(async () => {
        cancelClassRequest = await classRequestModel.create({
          type: ClassRequestType.CANCEL_CLASS,
          status: ClassRequestStatus.PENDING,
          description: faker.lorem.paragraph(),
          classId: testClass._id,
          createdBy: new Types.ObjectId()
        })
      })

      it('should approve cancel class request successfully', async () => {
        const { body, status } = await request(global.app.getHttpServer())
          .patch(`/class-requests/management/${cancelClassRequest._id}/approve`)
          .set('Authorization', `Bearer ${staffAccessToken}`)
          .expect(200)

        expect(status).toBe(200)
        expect(body.data.success).toBe(true)

        const updatedRequest = await classRequestModel.findById(cancelClassRequest._id)
        expect(updatedRequest.status).toBe(ClassRequestStatus.APPROVED)
      })
    })
  })

  describe('PATCH /class-requests/management/:id/reject', () => {
    let classRequest: ClassRequest

    beforeEach(async () => {
      classRequest = await classRequestModel.create({
        type: ClassRequestType.PUBLISH_CLASS,
        status: ClassRequestStatus.PENDING,
        description: faker.lorem.paragraph(),
        courseId: testCourse._id,
        createdBy: new Types.ObjectId()
      })
    })

    it('should reject class request successfully', async () => {
      const { body, status } = await request(global.app.getHttpServer())
        .patch(`/class-requests/management/${classRequest._id}/reject`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({ rejectReason: faker.lorem.sentence() })
        .expect(200)

      expect(status).toBe(200)
      expect(body.data.success).toBe(true)

      const updatedRequest = await classRequestModel.findById(classRequest._id)
      expect(updatedRequest.status).toBe(ClassRequestStatus.REJECTED)
      expect(updatedRequest.rejectReason).toBeDefined()
    })

    it('should return 404 when class request not found', async () => {
      await request(global.app.getHttpServer())
        .patch(`/class-requests/management/${new Types.ObjectId()}/reject`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({ rejectReason: faker.lorem.sentence() })
        .expect(404)
    })

    it('should return 400 when class request not in pending status', async () => {
      const rejectedRequest = await classRequestModel.create({
        type: ClassRequestType.PUBLISH_CLASS,
        status: ClassRequestStatus.REJECTED,
        description: faker.lorem.paragraph(),
        courseId: testCourse._id,
        createdBy: new Types.ObjectId()
      })

      await request(global.app.getHttpServer())
        .patch(`/class-requests/management/${rejectedRequest._id}/reject`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .send({ rejectReason: faker.lorem.sentence() })
        .expect(400)
    })
  })
})
