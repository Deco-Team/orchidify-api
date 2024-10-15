import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Class, ClassSchema } from '@src/class/schemas/class.schema'
import { IClassRepository, ClassRepository } from '@src/class/repositories/class.repository'
import { IClassService, ClassService } from '@src/class/services/class.service'
import { InstructorClassController } from './controllers/instructor.class.controller'
import { GardenModule } from '@garden/garden.module'
import { ISessionService, SessionService } from './services/session.service'
import { AssignmentService, IAssignmentService } from './services/assignment.service'
import { ManagementClassController } from './controllers/management.class.controller'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]), GardenModule],
  controllers: [InstructorClassController, ManagementClassController],
  providers: [
    {
      provide: IClassService,
      useClass: ClassService
    },
    {
      provide: ISessionService,
      useClass: SessionService
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
