import { PickType } from '@nestjs/swagger'
import { BaseCertificateDto } from './base.certificate.dto'

export class CreateCertificateDto extends PickType(BaseCertificateDto, ['code', 'name', 'url', 'ownerId']) {}
