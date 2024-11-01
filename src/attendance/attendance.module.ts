import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Attendance, AttendanceSchema } from '@attendance/schemas/attendance.schema'
import { IAttendanceRepository, AttendanceRepository } from '@attendance/repositories/attendance.repository'
import { IAttendanceService, AttendanceService } from '@attendance/services/attendance.service'
import { InstructorAttendanceController } from './controllers/instructor.attendance.controller'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Attendance.name, schema: AttendanceSchema }])],
  controllers: [InstructorAttendanceController],
  providers: [
    {
      provide: IAttendanceService,
      useClass: AttendanceService
    },
    {
      provide: IAttendanceRepository,
      useClass: AttendanceRepository
    }
  ],
  exports: [
    {
      provide: IAttendanceService,
      useClass: AttendanceService
    }
  ]
})
export class AttendanceModule {}
