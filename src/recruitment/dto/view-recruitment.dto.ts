import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseRecruitmentDto } from './base.recruitment.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { RECRUITMENT_DETAIL_PROJECTION, RECRUITMENT_LIST_PROJECTION } from '@recruitment/contracts/constant'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { RecruitmentStatus } from '@common/contracts/constant'
import { Transform } from 'class-transformer'
import { BaseStaffDto } from '@staff/dto/base.staff.dto'
import { Staff } from '@staff/schemas/staff.schema'

export class QueryRecruitmentDto {
  @ApiPropertyOptional({
    description: 'Name applicant to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name: string

  @ApiPropertyOptional({
    description: 'Email applicant to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  email: string

  @ApiPropertyOptional({
    enum: [
      RecruitmentStatus.PENDING,
      RecruitmentStatus.INTERVIEWING,
      RecruitmentStatus.SELECTED,
      RecruitmentStatus.EXPIRED,
      RecruitmentStatus.REJECTED
    ],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: RecruitmentStatus[]
}

class RecruitmentHandledByDto extends PickType(BaseStaffDto, ['_id', 'name']) {}
class RecruitmentDetailResponse extends PickType(BaseRecruitmentDto, RECRUITMENT_DETAIL_PROJECTION) {
  @ApiProperty({ type: RecruitmentHandledByDto })
  handledBy: Staff
}
export class RecruitmentDetailDataResponse extends DataResponse(RecruitmentDetailResponse) {}

class RecruitmentListItemResponse extends PickType(BaseRecruitmentDto, RECRUITMENT_LIST_PROJECTION) {
  @ApiProperty({ type: RecruitmentHandledByDto })
  handledBy: Staff
}
class RecruitmentListResponse extends PaginateResponse(RecruitmentListItemResponse) {}
export class RecruitmentListDataResponse extends DataResponse(RecruitmentListResponse) {}
