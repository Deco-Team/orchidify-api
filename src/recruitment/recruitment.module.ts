import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Recruitment, RecruitmentSchema } from '@src/recruitment/schemas/recruitment.schema'
import { IRecruitmentRepository, RecruitmentRepository } from '@src/recruitment/repositories/recruitment.repository'
import { IRecruitmentService, RecruitmentService } from '@src/recruitment/services/recruitment.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Recruitment.name, schema: RecruitmentSchema }])],
  controllers: [],
  providers: [
    {
      provide: IRecruitmentService,
      useClass: RecruitmentService
    },
    {
      provide: IRecruitmentRepository,
      useClass: RecruitmentRepository
    }
  ],
  exports: [
    {
      provide: IRecruitmentService,
      useClass: RecruitmentService
    }
  ]
})
export class RecruitmentModule {}
