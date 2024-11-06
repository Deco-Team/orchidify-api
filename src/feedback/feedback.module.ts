import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Feedback, FeedbackSchema } from '@feedback/schemas/feedback.schema'
import { IFeedbackRepository, FeedbackRepository } from '@feedback/repositories/feedback.repository'
import { IFeedbackService, FeedbackService } from '@feedback/services/feedback.service'
import { InstructorFeedbackController } from './controllers/instructor.feedback.controller'
import { LearnerFeedbackController } from './controllers/learner.feedback.controller'
import { ManagementFeedbackController } from './controllers/management.feedback.controller'

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Feedback.name, schema: FeedbackSchema }])],
  controllers: [InstructorFeedbackController, LearnerFeedbackController, ManagementFeedbackController],
  providers: [
    {
      provide: IFeedbackService,
      useClass: FeedbackService
    },
    {
      provide: IFeedbackRepository,
      useClass: FeedbackRepository
    }
  ],
  exports: [
    {
      provide: IFeedbackService,
      useClass: FeedbackService
    }
  ]
})
export class FeedbackModule {}
