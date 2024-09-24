import { ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseStaffDto } from './base.staff.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { StaffStatus } from '@common/contracts/constant'
import { Transform } from 'class-transformer'
import { STAFF_LIST_PROJECTION } from '@staff/contracts/constant'

export class QueryStaffDto {
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
    enum: StaffStatus,
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: StaffStatus[]
}

class StaffDetailResponse extends PickType(BaseStaffDto, STAFF_LIST_PROJECTION) {}

class StaffListResponse extends PaginateResponse(StaffDetailResponse) {}

export class StaffListDataResponse extends DataResponse(StaffListResponse) {}

export class StaffDetailDataResponse extends DataResponse(StaffDetailResponse) {}
