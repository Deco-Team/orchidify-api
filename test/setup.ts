import { AppLogger } from '@common/services/app-logger.service'
import { Test } from '@nestjs/testing'
import { AppModule } from '@src/app.module'
import { useContainer } from 'class-validator'
import { AppValidationPipe } from '@common/pipes/app-validate.pipe'
import { TrimRequestBodyPipe } from '@common/pipes/trim-req-body.pipe'
import { TransformInterceptor } from '@common/interceptors/transform.interceptor'
import { AppExceptionFilter } from '@common/exceptions/app-exception.filter'
import { INotificationService } from '@notification/services/notification.service'

module.exports = async function (globalConfig, projectConfig) {
  console.log('jest setup test')

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule]
  })
    .overrideProvider('FIREBASE_APP')
    .useValue({
      auth: () => ({}),
      firestore: () => ({ collection: () => ({}) }),
      messaging: () => ({})
    })
    .overrideProvider(INotificationService)
    .useValue({
      sendMail: () => {},
      sendFirebaseCloudMessaging: () => {},
      sendTopicFirebaseCloudMessaging: () => {}
    })
    .compile()

  const app = moduleRef.createNestApplication()
  const logger = app.get(AppLogger)
  app.useLogger(logger)
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new AppExceptionFilter(logger))
  const globalPipes = [new TrimRequestBodyPipe(), new AppValidationPipe()]
  app.useGlobalPipes(...globalPipes)

  // Adding custom validator decorator
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  await app.init()

  global.rootModule = moduleRef
  global.app = app
}
