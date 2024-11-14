import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { LearnerCertificateController } from './controllers/learner.certificate.controller'
import { Certificate } from 'crypto'
import { CertificateSchema } from './schemas/certificate.schema'
import { CertificateService, ICertificateService } from './services/certificate.service'
import { CertificateRepository, ICertificateRepository } from './repositories/certificate.repository'

@Module({
  imports: [MongooseModule.forFeature([{ name: Certificate.name, schema: CertificateSchema }])],
  controllers: [LearnerCertificateController],
  providers: [
    {
      provide: ICertificateService,
      useClass: CertificateService
    },
    {
      provide: ICertificateRepository,
      useClass: CertificateRepository
    }
  ],
  exports: [
    {
      provide: ICertificateService,
      useClass: CertificateService
    }
  ]
})
export class CertificateModule {}
