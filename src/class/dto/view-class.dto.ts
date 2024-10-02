import { ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseClassDto } from './base.class.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { ClassStatus } from '@common/contracts/constant'
import { Transform } from 'class-transformer'
import {
  INSTRUCTOR_VIEW_CLASS_DETAIL_PROJECTION,
  INSTRUCTOR_VIEW_CLASS_LIST_PROJECTION
} from '@src/class/contracts/constant'

export class QueryClassDto {
  @ApiPropertyOptional({
    description: 'Title to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  title: string

  @ApiPropertyOptional({
    enum: [ClassStatus.PUBLISHED, ClassStatus.IN_PROGRESS, ClassStatus.COMPLETED, ClassStatus.CANCELED],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: ClassStatus[]
}

class InstructorViewClassListItemResponse extends PickType(BaseClassDto, INSTRUCTOR_VIEW_CLASS_LIST_PROJECTION) {}
class InstructorViewClassListResponse extends PaginateResponse(InstructorViewClassListItemResponse) {}
export class InstructorViewClassListDataResponse extends DataResponse(InstructorViewClassListResponse) {}

class InstructorViewClassDetailResponse extends PickType(BaseClassDto, INSTRUCTOR_VIEW_CLASS_DETAIL_PROJECTION) {}
export class InstructorViewClassDetailDataResponse extends DataResponse(InstructorViewClassDetailResponse) {}
