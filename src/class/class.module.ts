import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Class, ClassSchema } from '@src/class/schemas/class.schema'
import { IClassRepository, ClassRepository } from '@src/class/repositories/class.repository'
import { IClassService, ClassService } from '@src/class/services/class.service'
// import { InstructorClassController } from './controllers/instructor.class.controller'
import { GardenModule } from '@garden/garden.module'
import { ILessonService, LessonService } from './services/lesson.service'
import { AssignmentService, IAssignmentService } from './services/assignment.service'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]), GardenModule],
  // controllers: [InstructorClassController],
  providers: [
    {
      provide: IClassService,
      useClass: ClassService
    },
    {
      provide: ILessonService,
      useClass: LessonService
    },
    {
      provide: IAssignmentService,
      useClass: AssignmentService
    },
    {
      provide: IClassRepository,
      useClass: ClassRepository
    }
  ],
  exports: [
    {
      provide: IClassService,
      useClass: ClassService
    }
  ]
})
export class ClassModule {}
