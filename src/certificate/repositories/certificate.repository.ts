import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Certificate, CertificateDocument } from '@certificate/schemas/certificate.schema'
import { AbstractRepository } from '@common/repositories'

export const ICertificateRepository = Symbol('ICertificateRepository')

export interface ICertificateRepository extends AbstractRepository<CertificateDocument> {}

@Injectable()
export class CertificateRepository extends AbstractRepository<CertificateDocument> implements ICertificateRepository {
  constructor(@InjectModel(Certificate.name) model: PaginateModel<CertificateDocument>) {
    super(model)
  }
}
