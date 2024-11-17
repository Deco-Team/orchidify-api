import { Errors } from '@common/contracts/error'
import { PaginationParams } from '@common/decorators/pagination.decorator'
import { AppException } from '@common/exceptions/app.exception'
import { HelperService } from '@common/services/helper.service'
import { Injectable, Inject } from '@nestjs/common'
import { CERTIFICATE_LIST_PROJECTION } from '@certificate/contracts/constant'
import { CreateCertificateDto } from '@certificate/dto/create-certificate.dto'
import { QueryCertificateDto } from '@certificate/dto/view-certificate.dto'
import { ICertificateRepository } from '@certificate/repositories/certificate.repository'
import { Certificate, CertificateDocument } from '@certificate/schemas/certificate.schema'
import { FilterQuery, PopulateOptions, QueryOptions, SaveOptions, Types, UpdateQuery } from 'mongoose'

export const ICertificateService = Symbol('ICertificateService')

export interface ICertificateService {
  create(createCertificateDto: CreateCertificateDto, options?: SaveOptions | undefined): Promise<CertificateDocument>
  findById(
    certificateId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ): Promise<CertificateDocument>
  update(
    conditions: FilterQuery<Certificate>,
    payload: UpdateQuery<Certificate>,
    options?: QueryOptions | undefined
  ): Promise<CertificateDocument>
  list(pagination: PaginationParams, queryCertificateDto: QueryCertificateDto)
  generateCertificateCode(length?: number, startTime?: number): string
}

@Injectable()
export class CertificateService implements ICertificateService {
  constructor(
    @Inject(ICertificateRepository)
    private readonly certificateRepository: ICertificateRepository,
    private readonly helperService: HelperService
  ) {}

  public async create(createCertificateDto: CreateCertificateDto, options?: SaveOptions | undefined) {
    const certificateCode = await this.generateCertificateCode()
    createCertificateDto['code'] = certificateCode

    const certificate = await this.certificateRepository.create(createCertificateDto, options)
    return certificate
  }

  public async findById(
    certificateId: string,
    projection?: string | Record<string, any>,
    populates?: Array<PopulateOptions>
  ) {
    const certificate = await this.certificateRepository.findOne({
      conditions: {
        _id: certificateId
      },
      projection,
      populates
    })
    return certificate
  }

  public update(
    conditions: FilterQuery<Certificate>,
    payload: UpdateQuery<CertificateDocument>,
    options?: QueryOptions | undefined
  ) {
    return this.certificateRepository.findOneAndUpdate(conditions, payload, options)
  }

  async list(
    pagination: PaginationParams,
    queryCertificateDto: QueryCertificateDto,
    projection = CERTIFICATE_LIST_PROJECTION
  ) {
    const { ownerId } = queryCertificateDto
    const filter: Record<string, any> = {
      ownerId: new Types.ObjectId(ownerId)
    }

    return this.certificateRepository.model.paginate(filter, {
      ...pagination,
      projection
    })
  }

  public async generateCertificateCode(length = 8, startTime = Date.now()) {
    const code = 'OC' + this.helperService.generateRandomString(length)
    const certificate = await this.certificateRepository.findOne({
      conditions: {
        code
      }
    })

    const elapsedTime = Date.now() - startTime
    if (!certificate) return code
    const isRetry = elapsedTime < 60 * 1000
    if (isRetry) return await this.generateCertificateCode(length, startTime)
    throw new AppException(Errors.INTERNAL_SERVER_ERROR)
  }
}
