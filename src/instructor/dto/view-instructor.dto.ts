import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseInstructorDto, InstructorCertificateDto } from './base.instructor.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { INSTRUCTOR_DETAIL_PROJECTION, INSTRUCTOR_LIST_PROJECTION, INSTRUCTOR_PROFILE_PROJECTION, VIEWER_VIEW_INSTRUCTOR_DETAIL_PROJECTION } from '@instructor/contracts/constant'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { InstructorStatus } from '@common/contracts/constant'
import { Transform } from 'class-transformer'

class InstructorProfileResponse extends PickType(BaseInstructorDto, INSTRUCTOR_PROFILE_PROJECTION) {}
export class InstructorProfileDataResponse extends DataResponse(InstructorProfileResponse) {}

class InstructorCertificationsResponse {
  @ApiProperty({ type: InstructorCertificateDto, isArray: true })
  docs: InstructorCertificateDto[]
}
export class InstructorCertificationsDataResponse extends DataResponse(InstructorCertificationsResponse) {}

export class QueryInstructorDto {
  @ApiPropertyOptional({
    description: 'Name to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name: string

  @ApiPropertyOptional({
    description: 'Email to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  email: string

  @ApiPropertyOptional({
    enum: [InstructorStatus.ACTIVE, InstructorStatus.INACTIVE],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: InstructorStatus[]
}

class InstructorDetailResponse extends PickType(BaseInstructorDto, INSTRUCTOR_DETAIL_PROJECTION) {}
export class InstructorDetailDataResponse extends DataResponse(InstructorDetailResponse) {}

class InstructorListItemResponse extends PickType(BaseInstructorDto, INSTRUCTOR_LIST_PROJECTION) {}
class InstructorListResponse extends PaginateResponse(InstructorListItemResponse) {}
export class InstructorListDataResponse extends DataResponse(InstructorListResponse) {}


class ViewerViewInstructorDetailResponse extends PickType(BaseInstructorDto, VIEWER_VIEW_INSTRUCTOR_DETAIL_PROJECTION) {}
export class ViewerViewInstructorDetailDataResponse extends DataResponse(ViewerViewInstructorDetailResponse) {}
