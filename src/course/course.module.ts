import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InstructorCourseController } from './controllers/instructor.course.controller'
import { CourseService, ICourseService } from './services/course.service'
import { ICourseSessionService, CourseSessionService } from './services/course-session.service'
import { ICourseAssignmentService, CourseAssignmentService } from './services/course-assignment.service'
import { CourseRepository, ICourseRepository } from './repositories/course.repository'
import { GardenModule } from '@garden/garden.module'
import { Course, CourseSchema } from './schemas/course.schema'
import { ManagementCourseController } from './controllers/management.course.controller'
import { CourseController } from './controllers/learner.course.controller'
import { InstructorCourseComboController } from './controllers/instructor.course-combo.controller'
import { CourseComboService, ICourseComboService } from './services/course-combo.service'
import { ManagementCourseComboController } from './controllers/management.course-combo.controller'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]), GardenModule],
  controllers: [
    InstructorCourseController,
    ManagementCourseController,
    CourseController,
    InstructorCourseComboController,
    ManagementCourseComboController
  ],
  providers: [
    {
      provide: ICourseService,
      useClass: CourseService
    },
    {
      provide: ICourseComboService,
      useClass: CourseComboService
    },
    {
      provide: ICourseSessionService,
      useClass: CourseSessionService
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
    },
    {
      provide: ICourseComboService,
      useClass: CourseComboService
    }
  ]
})
export class CourseModule {}
