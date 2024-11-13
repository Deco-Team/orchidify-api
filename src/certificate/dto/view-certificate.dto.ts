import { PickType } from '@nestjs/swagger'
import { BaseCertificateDto } from './base.certificate.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { CERTIFICATE_LIST_PROJECTION } from '@certificate/contracts/constant'

export class QueryCertificateDto {
  // @ApiPropertyOptional({
  //   description: 'Name to search'
  // })
  // @IsOptional()
  // @IsString()
  // @MaxLength(50)
  // name: string
  ownerId: string
}

class CertificateDetailResponse extends PickType(BaseCertificateDto, CERTIFICATE_LIST_PROJECTION) {}

class CertificateListResponse extends PaginateResponse(CertificateDetailResponse) {}

export class CertificateListDataResponse extends DataResponse(CertificateListResponse) {}

export class CertificateDetailDataResponse extends DataResponse(CertificateDetailResponse) {}
