import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Course, CourseSchema } from '@course/schemas/course.schema'
import {
  ICourseRepository,
  CourseRepository
} from '@course/repositories/course.repository'
import { ICourseService, CourseService } from '@course/services/course.service'
import { InstructorCourseController } from './controllers/instructor.course.controller'
import { GardenModule } from '@garden/garden.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]), GardenModule],
  controllers: [InstructorCourseController],
  providers: [
    {
      provide: ICourseService,
      useClass: CourseService
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
