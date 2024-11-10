import { Module } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { FirebaseRepository, IFirebaseRepository } from './repositories/firebase.repository'
import { ISettingService } from '@setting/services/setting.service'
import { SettingKey } from '@setting/contracts/constant'
import { FirebaseController } from './controllers/firebase.controller'
import { FirebaseService, IFirebaseService } from './services/firebase.service'
import { LearnerModule } from '@learner/learner.module'
import { InstructorModule } from '@instructor/instructor.module'

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ISettingService],
  useFactory: async (settingService: ISettingService) => {
    const firebaseConfig = ((await settingService.findByKey(SettingKey.FirebaseConfig)).value ||
      {}) as admin.ServiceAccount

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
    })
  }
}

@Module({
  imports: [LearnerModule, InstructorModule],
  controllers: [FirebaseController],
  providers: [
    firebaseProvider,
    {
      provide: IFirebaseRepository,
      useClass: FirebaseRepository
    },
    {
      provide: IFirebaseService,
      useClass: FirebaseService
    }
  ],
  exports: []
})
export class FirebaseModule {}
