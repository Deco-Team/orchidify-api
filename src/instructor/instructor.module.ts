import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Instructor, InstructorSchema } from '@src/instructor/schemas/instructor.schema'
import { IInstructorRepository, InstructorRepository } from '@src/instructor/repositories/instructor.repository'
import { IInstructorService, InstructorService } from '@src/instructor/services/instructor.service'
import { InstructorController } from './controllers/instructor.controller'
import { ManagementInstructorController } from './controllers/management.instructor.controller'
import { LearnerInstructorController } from './controllers/learner.instructor.controller'
import { RecruitmentModule } from '@recruitment/recruitment.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Instructor.name, schema: InstructorSchema }]), RecruitmentModule],
  controllers: [InstructorController, ManagementInstructorController, LearnerInstructorController],
  providers: [
    {
      provide: IInstructorService,
      useClass: InstructorService
    },
    {
      provide: IInstructorRepository,
      useClass: InstructorRepository
    }
  ],
  exports: [
    {
      provide: IInstructorService,
      useClass: InstructorService
    }
  ]
})
export class InstructorModule {}
