import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InstructorCourseController } from './controllers/instructor.course.controller'
import { CourseService, ICourseService } from './services/course.service'
import { ICourseLessonService, CourseLessonService } from './services/course-lesson.service'
import { ICourseAssignmentService, CourseAssignmentService } from './services/course-assignment.service'
import { CourseRepository, ICourseRepository } from './repositories/course.repository'
import { GardenModule } from '@garden/garden.module'
import { Course, CourseSchema } from './schemas/course.schema'
import { ManagementCourseController } from './controllers/management.course.controller'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]), GardenModule],
  controllers: [InstructorCourseController, ManagementCourseController],
  providers: [
    {
      provide: ICourseService,
      useClass: CourseService
    },
    {
      provide: ICourseLessonService,
      useClass: CourseLessonService
    },
    {
      provide: ICourseAssignmentService,
      useClass: CourseAssignmentService
    },
    {
      provide: ICourseRepository,
      useClass: CourseRepository
    }
  ],
  exports: [
    {
      provide: ICourseService,
      useClass: CourseService
    }
  ]
})
export class CourseModule {}
