import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PayoutRequest, PayoutRequestSchema } from '@src/payout-request/schemas/payout-request.schema'
import {
  IPayoutRequestRepository,
  PayoutRequestRepository
} from '@src/payout-request/repositories/payout-request.repository'
import { IPayoutRequestService, PayoutRequestService } from '@src/payout-request/services/payout-request.service'
import { InstructorPayoutRequestController } from './controllers/instructor.payout-request.controller'
import { ManagementPayoutRequestController } from './controllers/management.payout-request.controller'
import { InstructorModule } from '@instructor/instructor.module'
import { StaffModule } from '@staff/staff.module'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: PayoutRequest.name, schema: PayoutRequestSchema }]),
    InstructorModule,
    StaffModule
  ],
  controllers: [InstructorPayoutRequestController, ManagementPayoutRequestController],
  providers: [
    {
      provide: IPayoutRequestService,
      useClass: PayoutRequestService
    },
    {
      provide: IPayoutRequestRepository,
      useClass: PayoutRequestRepository
    }
  ],
  exports: [
    {
      provide: IPayoutRequestService,
      useClass: PayoutRequestService
    }
  ]
})
export class PayoutRequestModule {}
