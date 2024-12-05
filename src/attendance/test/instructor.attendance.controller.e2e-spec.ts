import { getModelToken } from '@nestjs/mongoose'
import { AttendanceStatus, LearnerStatus, UserRole } from '@common/contracts/constant'
import { Instructor, InstructorDocument } from '@instructor/schemas/instructor.schema'
import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { GardenTimesheet, GardenTimesheetDocument } from '@garden-timesheet/schemas/garden-timesheet.schema'
import { LearnerClass, LearnerClassDocument } from '@class/schemas/learner-class.schema'
const moment = require('moment')
import { Learner, LearnerDocument } from '@learner/schemas/learner.schema'
import { Attendance, AttendanceDocument } from '@attendance/schemas/attendance.schema'
import { VN_TIMEZONE } from '@src/config'
import { Errors } from '@common/contracts/error'

describe('InstructorAttendanceController (e2e)', () => {
  let accessToken
  let instructorModel: Model<InstructorDocument>
  let learnerModel: Model<LearnerDocument>
  let learnerClassModel: Model<LearnerClassDocument>
  let gardenTimesheetModel: Model<GardenTimesheetDocument>
  let attendanceModel: Model<AttendanceDocument>
  let mockClassId = new Types.ObjectId()
  let instructorTestData = {
    _id: new Types.ObjectId(),
    email: 'instructor@gmail.com',
    password: 'aA@123456',
    name: 'Orchidfy Instructor',
    idCardPhoto: 'idCardPhoto',
    dateOfBirth: '2000-12-12T00:00:00.000Z',
    phone: '0987654321'
  }
  let learnerTestData = [
    {
      _id: new Types.ObjectId(),
      email: 'learner@gmail.com',
      password: 'aA@123456',
      name: 'Orchidfy Learner',
      avatar: 'avatar',
      status: LearnerStatus.ACTIVE
    },
    {
      _id: new Types.ObjectId(),
      email: 'learner1@gmail.com',
      password: 'aA@123456',
      name: 'Orchidfy Learner 1',
      avatar: 'avatar',
      status: LearnerStatus.ACTIVE
    }
  ]
  let learnerClassTestData = [
    {
      _id: new Types.ObjectId(),
      enrollDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      transactionId: new Types.ObjectId(),
      learnerId: learnerTestData[0]._id,
      classId: mockClassId,
      courseId: new Types.ObjectId()
    },
    {
      _id: new Types.ObjectId(),
      enrollDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      transactionId: new Types.ObjectId(),
      learnerId: learnerTestData[1]._id,
      classId: mockClassId,
      courseId: new Types.ObjectId()
    }
  ]
  let gardenTimesheetTakeAttendanceTestData = {
    _id: new Types.ObjectId().toString(),
    date: new Date(Date.now()).toISOString(),
    gardenId: new Types.ObjectId(),
    slots: [
      {
        _id: new Types.ObjectId(),
        slotNumber: 1,
        start: moment().tz(VN_TIMEZONE).subtract(1, 'day').subtract(1, 'hour').startOf('hour').toISOString(),
        end: moment().tz(VN_TIMEZONE).subtract(2, 'day').add(1, 'hour').startOf('hour').toISOString(),
        instructorId: instructorTestData._id,
        classId: mockClassId
      },
      {
        _id: new Types.ObjectId(),
        slotNumber: 2,
        start: moment().tz(VN_TIMEZONE).hour(9).minute(30).startOf('minute').toISOString(),
        end: moment().tz(VN_TIMEZONE).hour(11).minute(30).startOf('minute').toISOString(),
        instructorId: instructorTestData._id,
        classId: mockClassId,
        hasTakenAttendance: true
      },
      {
        _id: new Types.ObjectId(),
        slotNumber: 3,
        start: moment().tz(VN_TIMEZONE).startOf('hour').toISOString(),
        end: moment().tz(VN_TIMEZONE).add(1, 'hour').startOf('hour').toISOString(),
        instructorId: instructorTestData._id,
        classId: mockClassId
      },
      {
        _id: new Types.ObjectId(),
        slotNumber: 4,
        start: moment().tz(VN_TIMEZONE).add(1, 'hour').startOf('hour').toISOString(),
        end: moment().tz(VN_TIMEZONE).add(2, 'hour').startOf('hour').toISOString(),
        instructorId: instructorTestData._id,
        classId: mockClassId
      }
    ],
    gardenMaxClass: 1
  }
  let attendanceTestData = [
    {
      _id: new Types.ObjectId(),
      status: AttendanceStatus.PRESENT,
      learnerId: learnerTestData[0]._id,
      slotId: gardenTimesheetTakeAttendanceTestData.slots[1]._id,
      classId: mockClassId
    },
    {
      _id: new Types.ObjectId(),
      status: AttendanceStatus.PRESENT,
      learnerId: learnerTestData[1]._id,
      slotId: gardenTimesheetTakeAttendanceTestData.slots[1]._id,
      classId: mockClassId
    }
  ]

  beforeAll(async () => {
    const jwtService = global.rootModule.get(JwtService)
    const configService = global.rootModule.get(ConfigService)
    instructorModel = global.rootModule.get(getModelToken(Instructor.name))
    learnerModel = global.rootModule.get(getModelToken(Learner.name))
    learnerClassModel = global.rootModule.get(getModelToken(LearnerClass.name))
    gardenTimesheetModel = global.rootModule.get(getModelToken(GardenTimesheet.name))
    attendanceModel = global.rootModule.get(getModelToken(Attendance.name))

    // Generate access token to be used in the tests
    accessToken = jwtService.sign(
      {
        sub: instructorTestData._id,
        role: UserRole.INSTRUCTOR
      },
      {
        secret: configService.get('JWT_ACCESS_SECRET')
      }
    )

    // Insert test data
    await instructorModel.create(instructorTestData)
    await learnerModel.create(learnerTestData)
    await learnerClassModel.create(learnerClassTestData)
    await gardenTimesheetModel.create(gardenTimesheetTakeAttendanceTestData)
    await attendanceModel.create(attendanceTestData)
  })

  afterAll(async () => {
    // Clean up test data
    await instructorModel.deleteMany({})
    await learnerModel.deleteMany({})
    await learnerClassModel.deleteMany({})
    await gardenTimesheetModel.deleteMany({})
    await attendanceModel.deleteMany({})
    jest.clearAllMocks()
  })

  describe('GET /attendances/instructor/:slotId', () => {
    it('should return attendance list with status NOT_YET', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/attendances/instructor/${gardenTimesheetTakeAttendanceTestData.slots[0]._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
      expect(status).toBe(200)
      expect(data.docs).toHaveLength[1]
    })

    it('should return attendance list', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/attendances/instructor/${gardenTimesheetTakeAttendanceTestData.slots[1]._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
      expect(status).toBe(200)
      expect(data.docs[0]).toMatchObject({
        _id: attendanceTestData[0]._id.toString(),
        status: attendanceTestData[0].status,
        learnerId: learnerClassTestData[0].learnerId.toString(),
        learner: {
          _id: learnerTestData[0]._id.toString(),
          name: learnerTestData[0].name,
          avatar: learnerTestData[0].avatar
        }
      })
    })

    it('should return 404 error if slot not found', async () => {
      const {
        body: { message },
        status
      } = await request(global.app.getHttpServer())
        .get(`/attendances/instructor/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
      expect(status).toBe(404)
      expect(message).toBe(Errors.SLOT_NOT_FOUND.message)
    })
  })

  describe('POST /attendances/instructor/:slotId', () => {
    it('should return 400 error if time to take attendance is over', async () => {
      const {
        body: { message },
        status
      } = await request(global.app.getHttpServer())
        .post(`/attendances/instructor/${gardenTimesheetTakeAttendanceTestData.slots[0]._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          attendances: [
            { learnerId: learnerClassTestData[0].learnerId, status: AttendanceStatus.PRESENT },
            { learnerId: learnerClassTestData[1].learnerId, status: AttendanceStatus.PRESENT }
          ]
        })
        .expect(400)
      expect(status).toBe(400)
      expect(message).toBe(Errors.TAKE_ATTENDANCE_IS_OVER.message)
    })

    it('should return 404 error if slot not found', async () => {
      const {
        body: { message },
        status
      } = await request(global.app.getHttpServer())
        .post(`/attendances/instructor/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          attendances: [
            { learnerId: learnerClassTestData[0].learnerId, status: AttendanceStatus.PRESENT },
            { learnerId: learnerClassTestData[1].learnerId, status: AttendanceStatus.PRESENT }
          ]
        })
        .expect(404)
      expect(status).toBe(404)
      expect(message).toBe(Errors.SLOT_NOT_FOUND.message)
    })

    it('should return 400 error if number of attendances invalid', async () => {
      const {
        body: { message },
        status
      } = await request(global.app.getHttpServer())
        .post(`/attendances/instructor/${gardenTimesheetTakeAttendanceTestData.slots[2]._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          attendances: [{ learnerId: learnerClassTestData[0].learnerId, status: AttendanceStatus.PRESENT }]
        })
        .expect(400)
      expect(status).toBe(400)
      expect(message).toBe(Errors.NUMBER_OF_ATTENDANCES_INVALID.message)
    })

    it('should return 400 error if number of attendances invalid', async () => {
      const {
        body: { message },
        status
      } = await request(global.app.getHttpServer())
        .post(`/attendances/instructor/${gardenTimesheetTakeAttendanceTestData.slots[2]._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          attendances: [
            { learnerId: learnerClassTestData[0].learnerId, status: AttendanceStatus.PRESENT },
            { learnerId: learnerClassTestData[0].learnerId, status: AttendanceStatus.PRESENT }
          ]
        })
        .expect(400)
      expect(status).toBe(400)
      expect(message).toBe(Errors.NUMBER_OF_ATTENDANCES_INVALID.message)
    })

    it('should take attendance', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .post(`/attendances/instructor/${gardenTimesheetTakeAttendanceTestData.slots[2]._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          attendances: [
            { learnerId: learnerClassTestData[0].learnerId, status: AttendanceStatus.PRESENT },
            { learnerId: learnerClassTestData[1].learnerId, status: AttendanceStatus.PRESENT }
          ]
        })
        .expect(201)
      expect(status).toBe(201)
      expect(data).toMatchObject({ success: true })

      const attendances = await attendanceModel.find({
        classId: gardenTimesheetTakeAttendanceTestData.slots[2].classId
      })
      expect(attendances.length).not.toEqual(0)
      expect(attendances[0].status).toEqual(AttendanceStatus.PRESENT)
    })

    it('should return 400 error if not time to take attendance', async () => {
      const {
        body: { message },
        status
      } = await request(global.app.getHttpServer())
        .post(`/attendances/instructor/${gardenTimesheetTakeAttendanceTestData.slots[3]._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          attendances: [
            { learnerId: learnerClassTestData[0].learnerId, status: AttendanceStatus.PRESENT },
            { learnerId: learnerClassTestData[1].learnerId, status: AttendanceStatus.PRESENT }
          ]
        })
        .expect(400)
      expect(status).toBe(400)
      expect(message).toBe(Errors.NOT_TIME_TO_TAKE_ATTENDANCE.message)
    })
  })
})
