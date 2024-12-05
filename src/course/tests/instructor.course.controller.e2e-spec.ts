import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import { UserRole, CourseStatus, InstructorStatus, CourseLevel } from '@common/contracts/constant'
import { Course } from '@course/schemas/course.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { Setting } from '@setting/schemas/setting.schema'
import { SettingKey } from '@setting/contracts/constant'
import { MediaResourceType, MediaType } from '@media/contracts/constant'

describe('InstructorCourseController (e2e)', () => {
  let courseModel: Model<Course>
  let instructorModel: Model<Instructor>
  let settingModel: Model<Setting>
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
    dateOfBirth: faker.date.past({ years: 20, refDate: '2000-10-10' })
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
    status: CourseStatus.DRAFT,
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
        ],
        assignments: [
          {
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
            attachments: [
              {
                asset_id: faker.string.uuid(),
                public_id: faker.string.uuid(),
                resource_type: MediaResourceType.video,
                type: MediaType.upload,
                url: faker.internet.url()
              }
            ]
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
    courseModel = global.rootModule.get(getModelToken(Course.name))
    instructorModel = global.rootModule.get(getModelToken(Instructor.name))
    settingModel = global.rootModule.get(getModelToken(Setting.name))
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
    await settingModel.create([
      {
        key: SettingKey.AssignmentsCountRange,
        value: [1, 3]
      }
    ])
  })

  afterAll(async () => {
    await courseModel.deleteMany({})
    await instructorModel.deleteMany({})
    await settingModel.deleteMany({})
  })

  describe('GET /courses/instructor', () => {
    it('should return course list', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/courses/instructor')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
    })
  })

  describe('GET /courses/instructor/:id', () => {
    it('should return course detail', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/courses/instructor/${testCourse._id}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(testCourse._id.toString())
      expect(data.title).toBe(testCourse.title)
    })

    it('should return 404 when course not found', async () => {
      const nonExistentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .get(`/courses/instructor/${nonExistentId}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(404)
    })
  })

  describe('GET /courses/instructor/:courseId/sessions/:sessionId', () => {
    let testSession
    let courseWithSessions

    beforeAll(async () => {
      // Create a course with sessions
      courseWithSessions = await courseModel.create({
        ...testCourse,
        _id: new Types.ObjectId(),
        sessions: [
          {
            _id: new Types.ObjectId(),
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
            sessionNumber: 1,
            assignments: []
          }
        ]
      })
      testSession = courseWithSessions.sessions[0]
    })

    it('should return session detail', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/courses/instructor/${courseWithSessions._id}/sessions/${testSession._id}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(testSession._id.toString())
      expect(data.title).toBe(testSession.title)
      expect(data.description).toBe(testSession.description)
      expect(data.sessionNumber).toBe(testSession.sessionNumber)
    })

    it('should return 404 when session not found', async () => {
      const nonExistentSessionId = new Types.ObjectId()

      await request(global.app.getHttpServer())
        .get(`/courses/instructor/${courseWithSessions._id}/sessions/${nonExistentSessionId}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(404)
    })
  })

  describe('GET /courses/instructor/:courseId/assignments/:assignmentId', () => {
    let testAssignment
    let courseWithAssignments

    beforeAll(async () => {
      // Create a course with sessions containing assignments
      courseWithAssignments = await courseModel.create({
        ...testCourse,
        _id: new Types.ObjectId(),
        sessions: [
          {
            _id: new Types.ObjectId(),
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
            sessionNumber: 1,
            assignments: [
              {
                _id: new Types.ObjectId(),
                title: faker.lorem.words(3),
                description: faker.lorem.paragraph()
              }
            ]
          }
        ]
      })
      testAssignment = courseWithAssignments.sessions[0].assignments[0]
      await courseModel.create(courseWithAssignments)
    })

    it('should return assignment detail', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/courses/instructor/${courseWithAssignments._id}/assignments/${testAssignment._id}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(testAssignment._id.toString())
      expect(data.title).toBe(testAssignment.title)
      expect(data.description).toBe(testAssignment.description)
      expect(data.deadline).toBe(testAssignment.deadline?.toString())
      expect(data.sessionNumber).toBe(1)
    })

    it('should return 404 when assignment not found', async () => {
      const nonExistentAssignmentId = new Types.ObjectId()

      await request(global.app.getHttpServer())
        .get(`/courses/instructor/${courseWithAssignments._id}/assignments/${nonExistentAssignmentId}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(404)
    })
  })

  describe('POST /courses/instructor', () => {
    it('should create new course', async () => {
      const newCourse = {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        price: 500000,
        level: CourseLevel.BASIC,
        type: ['Tách chiết'],
        duration: 4,
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
        sessions: Array(8)
          .fill(null)
          .map((_, index) => ({
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
            media: [
              {
                asset_id: faker.string.uuid(),
                public_id: faker.string.uuid(),
                resource_type: MediaResourceType.video,
                type: MediaType.upload,
                url: faker.internet.url()
              }
            ]
          })),
        learnerLimit: 20,
        gardenRequiredToolkits: faker.lorem.sentence()
      }
      newCourse.sessions[0]['assignments'] = [
        {
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          attachments: [
            {
              asset_id: faker.string.uuid(),
              public_id: faker.string.uuid(),
              resource_type: MediaResourceType.video,
              type: MediaType.upload,
              url: faker.internet.url()
            }
          ]
        }
      ]

      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .post('/courses/instructor')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send(newCourse)
        .expect(201)

      expect(status).toBe(201)
      expect(data._id).toBeDefined()

      const createdCourse = await courseModel.findById(data._id)
      expect(createdCourse).toBeDefined()
      expect(createdCourse.status).toBe(CourseStatus.DRAFT)
    })

    it('should return 400 when sessions count does not match duration', async () => {
      const invalidCourse = {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        price: 500000,
        level: CourseLevel.BASIC,
        type: ['Tách chiết'],
        duration: 4,
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
        sessions: Array(5)
          .fill(null)
          .map(() => ({
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
            media: [
              {
                asset_id: faker.string.uuid(),
                public_id: faker.string.uuid(),
                resource_type: MediaResourceType.video,
                type: MediaType.upload,
                url: faker.internet.url()
              }
            ]
          })),
        learnerLimit: 20,
        gardenRequiredToolkits: faker.lorem.sentence()
      }

      await request(global.app.getHttpServer())
        .post('/courses/instructor')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send(invalidCourse)
        .expect(400)
    })

    it('should return 400 when assignments count is outside allowed range', async () => {
      const tooManyAssignmentsCourse = {
        ...testCourse,
        sessions: Array(8)
          .fill(null)
          .map(() => ({
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
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
                title: faker.lorem.words(3),
                description: faker.lorem.paragraph(),
                attachments: [
                  {
                    asset_id: faker.string.uuid(),
                    public_id: faker.string.uuid(),
                    resource_type: MediaResourceType.video,
                    type: MediaType.upload,
                    url: faker.internet.url()
                  }
                ]
              }
            ]
          }))
      }

      await request(global.app.getHttpServer())
        .post('/courses/instructor')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send(tooManyAssignmentsCourse)
        .expect(400)
    })

    it('should return 400 when last session has assignments', async () => {
      const lastSessionWithAssignment = {
        ...testCourse,
        sessions: Array(8)
          .fill(null)
          .map((_, index) => ({
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
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
                title: faker.lorem.words(3),
                description: faker.lorem.paragraph(),
                attachments: [
                  {
                    asset_id: faker.string.uuid(),
                    public_id: faker.string.uuid(),
                    resource_type: MediaResourceType.video,
                    type: MediaType.upload,
                    url: faker.internet.url()
                  }
                ]
              }
            ]
          }))
      }

      await request(global.app.getHttpServer())
        .post('/courses/instructor')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send(lastSessionWithAssignment)
        .expect(400)
    })
  })

  describe('PUT /courses/instructor/:id', () => {
    it('should update course', async () => {
      const updatedTitle = faker.lorem.words(3)
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .put(`/courses/instructor/${testCourse._id}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send({
          ...testCourse,
          title: updatedTitle
        })
        .expect(200)

      expect(status).toBe(200)
      expect(data.success).toBe(true)

      const updatedCourse = await courseModel.findById(testCourse._id)
      expect(updatedCourse.title).toBe(updatedTitle)
    })

    it('should return 404 when course not found', async () => {
      const nonExistentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .put(`/courses/instructor/${nonExistentId}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send(testCourse)
        .expect(404)
    })

    it('should return 400 when updating non-draft course', async () => {
      const activeCourse = await courseModel.create({
        ...testCourse,
        _id: new Types.ObjectId(),
        status: CourseStatus.ACTIVE
      })

      await request(global.app.getHttpServer())
        .put(`/courses/instructor/${activeCourse._id}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send(testCourse)
        .expect(400)
    })

    it('should return 400 when updating requesting course', async () => {
      const requestingCourse = await courseModel.create({
        ...testCourse,
        _id: new Types.ObjectId(),
        isRequesting: true
      })

      await request(global.app.getHttpServer())
        .put(`/courses/instructor/${requestingCourse._id}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send(testCourse)
        .expect(400)
    })
  })

  describe('DELETE /courses/instructor/:id', () => {
    it('should delete course', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .delete(`/courses/instructor/${testCourse._id}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.success).toBe(true)

      const deletedCourse = await courseModel.findById(testCourse._id)
      expect(deletedCourse.status).toBe(CourseStatus.DELETED)
    })

    it('should return 404 when course not found', async () => {
      const nonExistentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .delete(`/courses/instructor/${nonExistentId}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(404)
    })
  })

  it('should return 400 when deleting non-draft course', async () => {
    const activeCourse = await courseModel.create({
      ...testCourse,
      _id: new Types.ObjectId(),
      status: CourseStatus.ACTIVE
    })

    await request(global.app.getHttpServer())
      .delete(`/courses/instructor/${activeCourse._id}`)
      .set('Authorization', `Bearer ${instructorAccessToken}`)
      .expect(400)
  })

  it('should return 400 when deleting requesting course', async () => {
    const requestingCourse = await courseModel.create({
      ...testCourse,
      _id: new Types.ObjectId(),
      isRequesting: true
    })

    await request(global.app.getHttpServer())
      .delete(`/courses/instructor/${requestingCourse._id}`)
      .set('Authorization', `Bearer ${instructorAccessToken}`)
      .expect(400)
  })
})
