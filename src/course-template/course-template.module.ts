import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InstructorCourseTemplateController } from './controllers/instructor.course-template.controller'
import { CourseTemplateService, ICourseTemplateService } from './services/course-template.service'
import { ITemplateLessonService, TemplateLessonService } from './services/template-lesson.service'
import { ITemplateAssignmentService, TemplateAssignmentService } from './services/template-assignment.service'
import { CourseTemplateRepository, ICourseTemplateRepository } from './repositories/course-template.repository'
import { GardenModule } from '@garden/garden.module'
import { CourseTemplate, CourseTemplateSchema } from './schemas/course-template.schema'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: CourseTemplate.name, schema: CourseTemplateSchema }]), GardenModule],
  controllers: [InstructorCourseTemplateController],
  providers: [
    {
      provide: ICourseTemplateService,
      useClass: CourseTemplateService
    },
    {
      provide: ITemplateLessonService,
      useClass: TemplateLessonService
    },
    {
      provide: ITemplateAssignmentService,
      useClass: TemplateAssignmentService
    },
    {
      provide: ICourseTemplateRepository,
      useClass: CourseTemplateRepository
    }
  ],
  exports: [
    {
      provide: ICourseTemplateService,
      useClass: CourseTemplateService
    }
  ]
})
export class CourseTemplateModule {}
