import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ReportService, IReportService } from './services/report.service'
import { ReportRepository, IReportRepository } from './repositories/report.repository'
import { GardenModule } from '@garden/garden.module'
import { Report, ReportSchema } from './schemas/report.schema'
import { ManagementReportController } from './controllers/management.report.controller'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]), GardenModule],
  controllers: [ManagementReportController],
  providers: [
    {
      provide: IReportService,
      useClass: ReportService
    },
    {
      provide: IReportRepository,
      useClass: ReportRepository
    }
  ],
  exports: [
    {
      provide: IReportService,
      useClass: ReportService
    }
  ]
})
export class ReportModule {}
