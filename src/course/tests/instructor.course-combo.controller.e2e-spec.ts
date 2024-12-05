import * as request from 'supertest'
import { Model, Types } from 'mongoose'
import { faker } from '@faker-js/faker'
import { UserRole, CourseStatus, InstructorStatus, CourseLevel } from '@common/contracts/constant'
import { Course } from '@course/schemas/course.schema'
import { getModelToken } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Instructor } from '@instructor/schemas/instructor.schema'
import { MediaResourceType, MediaType } from '@media/contracts/constant'

describe('InstructorCourseComboController (e2e)', () => {
  let courseModel: Model<Course>
  let instructorModel: Model<Instructor>
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
    instructorId: mockInstructorId,
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
    instructorId: mockInstructorId,
    learnerLimit: 20,
    childCourseIds: [],
    gardenRequiredToolkits: faker.lorem.sentence()
  }

  const testCourseCombo = {
    _id: new Types.ObjectId(),
    code: 'OCP002',
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
    instructorId: mockInstructorId,
    learnerLimit: 20,
    childCourseIds: [testChildCourse._id, testSecondChildCourse._id],
    discount: 10,
    gardenRequiredToolkits: faker.lorem.sentence()
  }

  beforeAll(async () => {
    courseModel = global.rootModule.get(getModelToken(Course.name))
    instructorModel = global.rootModule.get(getModelToken(Instructor.name))
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
    await courseModel.create(testChildCourse)
    await courseModel.create(testSecondChildCourse)
    await courseModel.create(testCourseCombo)
  })

  afterAll(async () => {
    await courseModel.deleteMany({})
    await instructorModel.deleteMany({})
  })

  describe('GET /courses/instructor/combo', () => {
    it('should return course combo list', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get('/courses/instructor/combo')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.docs).toBeInstanceOf(Array)
      expect(data.docs[0].childCourseIds).toBeDefined()
    })
  })

  describe('GET /courses/instructor/combo/:id', () => {
    it('should return course combo detail', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .get(`/courses/instructor/combo/${testCourseCombo._id}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data._id).toBe(testCourseCombo._id.toString())
      expect(data.childCourses).toBeDefined()
    })

    it('should return 404 when course combo not found', async () => {
      const nonExistentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .get(`/courses/instructor/combo/${nonExistentId}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(404)
    })
  })

  describe('POST /courses/instructor/combo', () => {
    it('should create new course combo', async () => {
      const newChildCourse = await courseModel.create({ ...testSecondChildCourse, _id: new Types.ObjectId() })

      const newCourseCombo = {
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
        childCourseIds: [testChildCourse._id.toString(), newChildCourse._id.toString()],
        learnerLimit: 20,
        discount: 15,
        gardenRequiredToolkits: faker.lorem.sentence()
      }

      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .post('/courses/instructor/combo')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send(newCourseCombo)
        .expect(201)

      expect(status).toBe(201)
      expect(data._id).toBeDefined()

      const createdCourseCombo = await courseModel.findById(data._id)
      expect(createdCourseCombo).toBeDefined()
      expect(createdCourseCombo.status).toBe(CourseStatus.ACTIVE)
      expect(createdCourseCombo.childCourseIds).toHaveLength(2)
    })

    it('should return 400 when child courses are invalid', async () => {
      const invalidCourseCombo = {
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
        childCourseIds: [new Types.ObjectId().toString(), new Types.ObjectId().toString()],
        learnerLimit: 20,
        discount: 15,
        gardenRequiredToolkits: faker.lorem.sentence()
      }

      await request(global.app.getHttpServer())
        .post('/courses/instructor/combo')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send(invalidCourseCombo)
        .expect(400)
    })

    it('should return 400 when course combo already exists', async () => {
      const existingCombo = {
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
        childCourseIds: [testChildCourse._id.toString(), testSecondChildCourse._id.toString()],
        learnerLimit: 20,
        discount: 15,
        gardenRequiredToolkits: faker.lorem.sentence()
      }

      await request(global.app.getHttpServer())
        .post('/courses/instructor/combo')
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send(existingCombo)
        .expect(400)
    })
  })

  describe('PUT /courses/instructor/combo/:id', () => {
    it('should update course combo', async () => {
      const updatedTitle = faker.lorem.words(3)
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .put(`/courses/instructor/combo/${testCourseCombo._id}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send({
          title: updatedTitle,
          description: testCourseCombo.description,
          childCourseIds: [testChildCourse._id.toString(), testSecondChildCourse._id.toString()],
          discount: 20
        })
        .expect(200)

      expect(status).toBe(200)
      expect(data.success).toBe(true)

      const updatedCourseCombo = await courseModel.findById(testCourseCombo._id)
      expect(updatedCourseCombo.title).toBe(updatedTitle)
    })

    it('should return 404 when course combo not found', async () => {
      const nonExistentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .put(`/courses/instructor/combo/${nonExistentId}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .send({
          title: faker.lorem.words(3),
          description: testCourseCombo.description,
          childCourseIds: [testChildCourse._id.toString(), testSecondChildCourse._id.toString()],
          discount: 20
        })
        .expect(404)
    })
  })

  describe('DELETE /courses/instructor/combo/:id', () => {
    it('should delete course combo', async () => {
      const {
        body: { data },
        status
      } = await request(global.app.getHttpServer())
        .delete(`/courses/instructor/combo/${testCourseCombo._id}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(200)

      expect(status).toBe(200)
      expect(data.success).toBe(true)

      const deletedCourseCombo = await courseModel.findById(testCourseCombo._id)
      expect(deletedCourseCombo.status).toBe(CourseStatus.DELETED)
    })

    it('should return 404 when course combo not found', async () => {
      const nonExistentId = new Types.ObjectId()
      await request(global.app.getHttpServer())
        .delete(`/courses/instructor/combo/${nonExistentId}`)
        .set('Authorization', `Bearer ${instructorAccessToken}`)
        .expect(404)
    })
  })
})
