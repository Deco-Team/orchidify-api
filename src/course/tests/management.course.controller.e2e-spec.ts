import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import { UserRole, CourseStatus, CourseLevel } from '@common/contracts/constant'
import { Course } from '@course/schemas/course.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { MediaResourceType, MediaType } from '@media/contracts/constant'

describe('ManagementCourseController (e2e)', () => {
  let courseModel: Model<Course>
  let jwtService: JwtService
  let configService: ConfigService
  let staffAccessToken: string
  const mockStaffId = new Types.ObjectId()

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
    instructorId: new Types.ObjectId(),
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
        _id: new Types.ObjectId(),
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

    await courseModel.create(testCourse)
    await courseModel.ensureIndexes()
  })

  afterAll(async () => {
    await courseModel.deleteMany({})
  })

  describe('GET /management', () => {
    it('should return course list for staff', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/courses/management')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
      expect(data.docs[0].status).toBe(CourseStatus.ACTIVE)
    })

    it('should filter courses by title', async () => {
      const {
        body: { data }
      } = await request(global.app.getHttpServer())
        .get('/courses/management')
        .query({ title: testCourse.title, sort: 'createdAt.desc_title.asc' })
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(data.docs[0].title).toBe(testCourse.title)
    })

    it('should filter courses by type', async () => {
      const {
        body: { data }
      } = await request(global.app.getHttpServer())
        .get('/courses/management')
        .query({ page: 1, limit: 10, type: testCourse.type[0], sort: '_' })
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(data.docs[0].type).toContain(testCourse.type[0])
    })

    it('should filter courses by level', async () => {
      const {
        body: { data }
      } = await request(global.app.getHttpServer())
        .get('/courses/management')
        .query({ level: [CourseLevel.BASIC] })
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(data.docs[0].level).toBe(CourseLevel.BASIC)
    })

    it('should return 401 for unauthorized access', async () => {
      await request(global.app.getHttpServer()).get('/courses/management').expect(401)
    })

    it('should return 403 for non-staff users', async () => {
      const learnerToken = jwtService.sign(
        {
          sub: new Types.ObjectId().toString(),
          role: UserRole.LEARNER
        },
        {
          secret: configService.get('JWT_ACCESS_SECRET')
        }
      )

      await request(global.app.getHttpServer())
        .get('/courses/management')
        .set('Authorization', `Bearer ${learnerToken}`)
        .expect(403)
    })
  })

  describe('GET /management/:id', () => {
    it('should return course detail', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/courses/management/${testCourse._id}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(testCourse._id.toString())
      expect(data.title).toBe(testCourse.title)
    })

    it('should return 404 when course not found', async () => {
      const nonExistentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .get(`/courses/management/${nonExistentId}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })

    it('should return 404 when course is not active', async () => {
      const draftCourse = await courseModel.create({
        ...testCourse,
        _id: new Types.ObjectId(),
        status: CourseStatus.DRAFT
      })

      await request(global.app.getHttpServer())
        .get(`/courses/management/${draftCourse._id}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })
  })

  describe('GET /management/:courseId/sessions/:sessionId', () => {
    it('should return session detail', async () => {
      const testSession = testCourse.sessions[0]
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/courses/management/${testCourse._id}/sessions/${testSession._id}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(testSession._id.toString())
      expect(data.title).toBe(testSession.title)
    })

    it('should return 404 when session not found', async () => {
      const nonExistentSessionId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .get(`/courses/management/${testCourse._id}/sessions/${nonExistentSessionId}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })
  })

  describe('GET /management/:courseId/assignments/:assignmentId', () => {
    it('should return assignment detail', async () => {
      const testAssignment = testCourse.sessions[0].assignments[0]
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/courses/management/${testCourse._id}/assignments/${testAssignment._id}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(testAssignment._id.toString())
      expect(data.title).toBe(testAssignment.title)
      expect(data.sessionNumber).toBe(1)
    })

    it('should return 404 when assignment not found', async () => {
      const nonExistentAssignmentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .get(`/courses/management/${testCourse._id}/assignments/${nonExistentAssignmentId}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })
  })
})
