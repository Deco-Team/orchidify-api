import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import { UserRole, CourseStatus, CourseLevel, ClassStatus } from '@common/contracts/constant'
import { Course } from '@course/schemas/course.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { MediaResourceType, MediaType } from '@media/contracts/constant'
import { LearnerClass } from '@class/schemas/learner-class.schema'
import { Class } from '@class/schemas/class.schema'

describe('LearnerCourseController (e2e)', () => {
  let courseModel: Model<Course>
  let classModel: Model<Class>
  let learnerClassModel: Model<LearnerClass>
  let jwtService: JwtService
  let configService: ConfigService

  const mockLearnerId = new Types.ObjectId()
  const mockInstructorId = new Types.ObjectId()
  let learnerAccessToken: string

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

  beforeAll(async () => {
    courseModel = global.rootModule.get(getModelToken(Course.name))
    classModel = global.rootModule.get(getModelToken(Class.name))
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

    await courseModel.create(testCourse)
    await classModel.create({
      courseId: testCourse._id,
      status: ClassStatus.PUBLISHED,
      garden: {
        _id: new Types.ObjectId(),
        name: faker.company.name()
      },
      progress: {
        total: 2,
        completed: 0,
        percentage: 0
      },
      instructorId: testCourse.instructorId,
      code: 'ORCHID001',
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
    })
  })

  afterAll(async () => {
    await courseModel.deleteMany({})
    await classModel.deleteMany({})
    await learnerClassModel.deleteMany({})
  })

  describe('GET /courses', () => {
    it('should return public course list', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer()).get('/courses').expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
    })

    it('should filter courses by title', async () => {
      const {
        body: { data }
      } = await request(global.app.getHttpServer()).get('/courses').query({ title: testCourse.title }).expect(200)

      expect(data.docs[0].title).toBe(testCourse.title)
    })

    it('should filter courses by price range', async () => {
      const {
        body: { data }
      } = await request(global.app.getHttpServer())
        .get('/courses')
        .query({ fromPrice: 400000, toPrice: 600000 })
        .expect(200)

      expect(data.docs[0].price).toBeLessThanOrEqual(600000)
      expect(data.docs[0].price).toBeGreaterThanOrEqual(400000)
    })
  })

  describe('GET /courses/learner', () => {
    it('should return course list for learner with discounts', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/courses/learner')
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs[0]).toHaveProperty('finalPrice')
      expect(data.docs[0]).toHaveProperty('discount')
    })
  })

  describe('GET /courses/learner/best-seller', () => {
    it('should return best seller courses', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/courses/learner/best-seller')
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
    })
  })

  describe('GET /courses/learner/recommended', () => {
    it('should return recommended courses', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/courses/learner/recommended')
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
    })
  })

  describe('GET /courses/:id', () => {
    it('should return course detail for learner', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/courses/${testCourse._id}`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(testCourse._id.toString())
      expect(data).toHaveProperty('finalPrice')
      expect(data).toHaveProperty('discount')
    })

    it('should return 404 when course not found', async () => {
      const nonExistentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .get(`/courses/${nonExistentId}`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(404)
    })

    it('should return 404 when course is not active', async () => {
      const draftCourse = await courseModel.create({
        ...testCourse,
        _id: new Types.ObjectId(),
        status: CourseStatus.DRAFT
      })

      await request(global.app.getHttpServer())
        .get(`/courses/${draftCourse._id}`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(404)
    })
  })

  describe('Course with classes', () => {
    let courseWithClass: Course

    beforeAll(async () => {
      courseWithClass = await courseModel.create({
        ...testCourse,
        _id: new Types.ObjectId()
      })

      await classModel.create({
        courseId: courseWithClass._id,
        status: ClassStatus.PUBLISHED,
        garden: {
          _id: new Types.ObjectId(),
          name: faker.company.name()
        },
        progress: {
          total: 2,
          completed: 0,
          percentage: 0
        },
        instructorId: testCourse.instructorId,
        code: 'ORCHID001',
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
      })
    })

    it('should return course with published classes', async () => {
      const {
        body: { data }
      } = await request(global.app.getHttpServer())
        .get(`/courses/${courseWithClass._id}`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(200)

      expect(data.classes).toBeInstanceOf(Array)
      expect(data.classes.length).toBeGreaterThan(0)
      expect(data.classes[0]).toHaveProperty('garden')
    })
  })

  describe('Course with combo discounts', () => {
    let comboCourse: Course
    let childCourse: Course
    let secondChildCourse: Course

    beforeAll(async () => {
      childCourse = await courseModel.create({
        ...testCourse,
        _id: new Types.ObjectId()
      })

      secondChildCourse = await courseModel.create({
        ...testCourse,
        _id: new Types.ObjectId()
      })

      comboCourse = await courseModel.create({
        ...testCourse,
        _id: new Types.ObjectId(),
        childCourseIds: [childCourse._id, secondChildCourse._id],
        discount: 20
      })

      await learnerClassModel.create({
        learnerId: mockLearnerId,
        courseId: childCourse._id,
        classId: new Types.ObjectId(),
        transactionId: new Types.ObjectId(),
        enrollDate: new Date()
      })
    })

    it('should apply combo discount when learner has related courses', async () => {
      const {
        body: { data }
      } = await request(global.app.getHttpServer())
        .get(`/courses/${secondChildCourse._id}`)
        .set('Authorization', `Bearer ${learnerAccessToken}`)
        .expect(200)

      expect(data.discount).toBe(20)
      expect(data.finalPrice).toBe(Math.round((data.price * (100 - 20)) / 100))
    })
  })
})
