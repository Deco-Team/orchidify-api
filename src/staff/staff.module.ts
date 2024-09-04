import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Staff, StaffSchema } from '@staff/schemas/staff.schema'
import { IStaffRepository, StaffRepository } from '@staff/repositories/staff.repository'
import { IStaffService, StaffService } from '@staff/services/staff.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }])],
  controllers: [],
  providers: [
    {
      provide: IStaffService,
      useClass: StaffService
    },
    {
      provide: IStaffRepository,
      useClass: StaffRepository
    }
  ],
  exports: [
    {
      provide: IStaffService,
      useClass: StaffService
    }
  ]
})
export class StaffModule {}
