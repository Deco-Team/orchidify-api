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
import { LearnerModule } from '@learner/learner.module'
import { LearnerClassController } from './controllers/learner.class.controller'
import { LearnerClass, LearnerClassSchema } from './schemas/learner-class.schema'
import { ILearnerClassService, LearnerClassService } from './services/learner-class.service'
import { ILearnerClassRepository, LearnerClassRepository } from './repositories/learner-class.repository'
import { AssignmentSubmission, AssignmentSubmissionSchema } from './schemas/assignment-submission.schema'
import { AssignmentSubmissionService, IAssignmentSubmissionService } from './services/assignment-submission.service'
import {
  AssignmentSubmissionRepository,
  IAssignmentSubmissionRepository
} from './repositories/assignment-submission.repository'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Class.name, schema: ClassSchema },
      { name: LearnerClass.name, schema: LearnerClassSchema },
      { name: AssignmentSubmission.name, schema: AssignmentSubmissionSchema }
    ]),
    GardenModule,
    LearnerModule
  ],
  controllers: [InstructorClassController, ManagementClassController, LearnerClassController],
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
    },
    {
      provide: ILearnerClassService,
      useClass: LearnerClassService
    },
    {
      provide: ILearnerClassRepository,
      useClass: LearnerClassRepository
    },
    {
      provide: IAssignmentSubmissionService,
      useClass: AssignmentSubmissionService
    },
    {
      provide: IAssignmentSubmissionRepository,
      useClass: AssignmentSubmissionRepository
    }
  ],
  exports: [
    {
      provide: IClassService,
      useClass: ClassService
    },
    {
      provide: ILearnerClassService,
      useClass: LearnerClassService
    },
    {
      provide: IAssignmentSubmissionService,
      useClass: AssignmentSubmissionService
    }
  ]
})
export class ClassModule {}
