import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ManagementGardenTimesheetController } from './controllers/management.garden-timesheet.controller'
import { GardenModule } from '@garden/garden.module'
import { GardenTimesheet, GardenTimesheetSchema } from './schemas/garden-timesheet.schema'
import { GardenTimesheetService, IGardenTimesheetService } from './services/garden-timesheet.service'
import { GardenTimesheetRepository, IGardenTimesheetRepository } from './repositories/garden-timesheet.repository'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: GardenTimesheet.name, schema: GardenTimesheetSchema }]), GardenModule],
  controllers: [ManagementGardenTimesheetController],
  providers: [
    {
      provide: IGardenTimesheetService,
      useClass: GardenTimesheetService
    },
    {
      provide: IGardenTimesheetRepository,
      useClass: GardenTimesheetRepository
    }
  ],
  exports: [
    {
      provide: IGardenTimesheetService,
      useClass: GardenTimesheetService
    }
  ]
})
export class GardenTimesheetModule {}
