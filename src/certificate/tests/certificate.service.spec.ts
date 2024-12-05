import { CreateCertificateDto } from '@certificate/dto/create-certificate.dto'
import { ICertificateRepository } from '@certificate/repositories/certificate.repository'
import { CertificateDocument } from '@certificate/schemas/certificate.schema'
import { CertificateService } from '@certificate/services/certificate.service'
import { HelperService } from '@common/services/helper.service'
import { Mocked } from '@suites/doubles.jest'
import { TestBed } from '@suites/unit'
import { Types } from 'mongoose'

describe('CertificateService', () => {
  let certificateService: CertificateService
  let helperService: Mocked<HelperService>
  let certificateRepository: Mocked<ICertificateRepository>

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(CertificateService).compile()

    certificateService = unit
    helperService = unitRef.get(HelperService)
    certificateRepository = unitRef.get(ICertificateRepository)
  })

  describe('create', () => {
    it('should create certificate', async () => {
      const createCertificateDto = {
        url: 'https://certificate.com',
        ownerId: new Types.ObjectId().toString(),
        learnerClassId: new Types.ObjectId().toString()
      }

      helperService.generateRandomString.mockReturnValue('certificateCode')

      certificateRepository.create.mockResolvedValue({
        _id: 'certificateId',
        code: 'OC-certificateCode',
        url: createCertificateDto.url,
        ownerId: new Types.ObjectId(createCertificateDto.ownerId),
        learnerClassId: new Types.ObjectId(createCertificateDto.learnerClassId)
      } as CertificateDocument)

      certificateRepository.findOne.mockResolvedValue(null)

      await certificateService.create(createCertificateDto as CreateCertificateDto)
      expect(helperService.generateRandomString).toHaveBeenCalled()
      expect(certificateRepository.create).toHaveBeenCalledWith(createCertificateDto, undefined)
    })
  })

  describe('update', () => {
    it('should update certificate', async () => {
      const conditions = {
        _id: new Types.ObjectId().toString()
      }
      const payload = {
        name: 'Certificate',
        url: 'https://certificate.com'
      }

      certificateRepository.findOneAndUpdate.mockResolvedValue({
        _id: conditions._id,
        name: payload.name,
        url: payload.url
      } as CertificateDocument)

      await certificateService.update(conditions, payload)

      expect(certificateRepository.findOneAndUpdate).toHaveBeenCalledWith(conditions, payload, undefined)
    })
  })

  describe('generateCertificateCode', () => {
    it('should throw error if certificate code generation fails', async () => {
      helperService.generateRandomString.mockReturnValue('sameCode')
      certificateRepository.findOne.mockResolvedValue({} as CertificateDocument)

      let error = undefined
      try {
        await certificateService.generateCertificateCode(8, Date.now() - 59999)
      } catch (err) {
        error = err
      }

      expect(error).toBeDefined()
    })
  })
})
