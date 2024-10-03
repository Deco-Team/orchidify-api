import { ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseRecruitmentDto } from './base.recruitment.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { RECRUITMENT_DETAIL_PROJECTION, RECRUITMENT_LIST_PROJECTION } from '@recruitment/contracts/constant'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { RecruitmentStatus } from '@common/contracts/constant'
import { Transform } from 'class-transformer'

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

class RecruitmentDetailResponse extends PickType(BaseRecruitmentDto, RECRUITMENT_DETAIL_PROJECTION) {}
export class RecruitmentDetailDataResponse extends DataResponse(RecruitmentDetailResponse) {}

class RecruitmentListItemResponse extends PickType(BaseRecruitmentDto, RECRUITMENT_LIST_PROJECTION) {}
class RecruitmentListResponse extends PaginateResponse(RecruitmentListItemResponse) {}
export class RecruitmentListDataResponse extends DataResponse(RecruitmentListResponse) {}
