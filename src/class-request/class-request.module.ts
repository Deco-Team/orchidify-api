import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ClassRequest, ClassRequestSchema } from '@src/class-request/schemas/class-request.schema'
import {
  IClassRequestRepository,
  ClassRequestRepository
} from '@src/class-request/repositories/class-request.repository'
import { IClassRequestService, ClassRequestService } from '@src/class-request/services/class-request.service'
import { InstructorClassRequestController } from './controllers/instructor.class-request.controller'
import { ManagementClassRequestController } from './controllers/management.class-request.controller'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: ClassRequest.name, schema: ClassRequestSchema }])],
  controllers: [InstructorClassRequestController, ManagementClassRequestController],
  providers: [
    {
      provide: IClassRequestService,
      useClass: ClassRequestService
    },
    {
      provide: IClassRequestRepository,
      useClass: ClassRequestRepository
    }
  ],
  exports: [
    {
      provide: IClassRequestService,
      useClass: ClassRequestService
    }
  ]
})
export class ClassRequestModule {}
