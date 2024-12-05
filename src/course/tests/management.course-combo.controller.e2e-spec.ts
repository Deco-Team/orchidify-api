import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import { UserRole, CourseStatus, CourseLevel } from '@common/contracts/constant'
import { Course } from '@course/schemas/course.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { MediaResourceType, MediaType } from '@media/contracts/constant'

describe('ManagementCourseComboController (e2e)', () => {
  let courseModel: Model<Course>
  let jwtService: JwtService
  let configService: ConfigService
  let staffAccessToken: string
  const mockStaffId = new Types.ObjectId()

  const testChildCourse = {
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
    learnerLimit: 20,
    childCourseIds: [],
    gardenRequiredToolkits: faker.lorem.sentence()
  }

  const testSecondChildCourse = {
    _id: new Types.ObjectId(),
    code: 'OCP002',
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
    learnerLimit: 20,
    childCourseIds: [],
    gardenRequiredToolkits: faker.lorem.sentence()
  }

  const testCourseCombo = {
    _id: new Types.ObjectId(),
    code: 'OCP003',
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    price: 900000,
    level: CourseLevel.BASIC,
    type: ['Combo'],
    duration: 2,
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
    learnerLimit: 20,
    childCourseIds: [testChildCourse._id, testSecondChildCourse._id],
    discount: 10,
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

    await courseModel.create(testChildCourse)
    await courseModel.create(testSecondChildCourse)
    await courseModel.create(testCourseCombo)
  })

  afterAll(async () => {
    await courseModel.deleteMany({})
  })

  describe('GET /courses/management/combo', () => {
    it('should return course combo list', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/courses/management/combo')
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
      expect(data.docs[0].childCourseIds).toBeDefined()
    })

    it('should return filtered course combo list when search by title', async () => {
      const {
        body: { data }
      } = await request(global.app.getHttpServer())
        .get('/courses/management/combo')
        .query({ title: testCourseCombo.title })
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(data.docs.length).toBeGreaterThan(0)
      expect(data.docs[0].title).toBe(testCourseCombo.title)
    })

    it('should return empty list when search with non-existent title', async () => {
      const {
        body: { data }
      } = await request(global.app.getHttpServer())
        .get('/courses/management/combo')
        .query({ title: 'nonexistenttitle' })
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(data.docs).toHaveLength(0)
    })
  })

  describe('GET /courses/management/combo/:id', () => {
    it('should return course combo detail', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/courses/management/combo/${testCourseCombo._id}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(testCourseCombo._id.toString())
      expect(data.childCourses).toBeDefined()
      expect(data.childCourses).toHaveLength(2)
    })

    it('should return 404 when course combo not found', async () => {
      const nonExistentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .get(`/courses/management/combo/${nonExistentId}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })

    it('should return 404 when course combo is not active', async () => {
      const inactiveCourseCombo = {
        ...testCourseCombo,
        _id: new Types.ObjectId(),
        status: CourseStatus.DRAFT
      }
      await courseModel.create(inactiveCourseCombo)

      await request(global.app.getHttpServer())
        .get(`/courses/management/combo/${inactiveCourseCombo._id}`)
        .set('Authorization', `Bearer ${staffAccessToken}`)
        .expect(404)
    })

    it('should return 401 when accessing without token', async () => {
      await request(global.app.getHttpServer())
        .get(`/courses/management/combo/${testCourseCombo._id}`)
        .expect(401)
    })

    it('should return 403 when accessing with non-staff role', async () => {
      const learnerAccessToken = jwtService.sign(
        {
          sub: new Types.ObjectId().toString(),
          role: UserRole.LEARNER
        },
        {
          secret: configService.get('JWT_ACCESS_SECRET')
        }
      )

      await request(global.app.getHttpServer())
        .get(`/courses/management/combo/${testCourseCombo._id}`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(403)
    })
  })
})
