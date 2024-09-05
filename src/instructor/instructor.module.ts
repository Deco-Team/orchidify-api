import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Instructor, InstructorSchema } from '@src/instructor/schemas/instructor.schema'
import { IInstructorRepository, InstructorRepository } from '@src/instructor/repositories/instructor.repository'
import { IInstructorService, InstructorService } from '@src/instructor/services/instructor.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Instructor.name, schema: InstructorSchema }])],
  controllers: [],
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
