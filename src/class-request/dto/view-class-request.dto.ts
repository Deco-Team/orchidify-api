import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseClassRequestDto } from './base.class-request.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsOptional } from 'class-validator'
import { ClassRequestStatus, ClassRequestType } from '@common/contracts/constant'
import { Transform } from 'class-transformer'
import { CLASS_REQUEST_DETAIL_PROJECTION, CLASS_REQUEST_LIST_PROJECTION } from '@src/class-request/contracts/constant'
import { Types } from 'mongoose'
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto'

export class QueryClassRequestDto {
  // @ApiPropertyOptional({
  //   description: 'Title to search'
  // })
  // @IsOptional()
  // @IsString()
  // @MaxLength(50)
  // title: string

  @ApiPropertyOptional({
    enum: [ClassRequestType.PUBLISH_CLASS],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  type: ClassRequestType[]

  @ApiPropertyOptional({
    enum: [
      ClassRequestStatus.PENDING,
      ClassRequestStatus.APPROVED,
      ClassRequestStatus.CANCELED,
      ClassRequestStatus.EXPIRED,
      ClassRequestStatus.REJECTED
    ],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: ClassRequestStatus[]

  createdBy: string
}

// Instructor
class InstructorViewClassRequestListItemResponse extends PickType(BaseClassRequestDto, CLASS_REQUEST_LIST_PROJECTION) {}
class InstructorViewClassRequestListResponse extends PaginateResponse(InstructorViewClassRequestListItemResponse) {}
export class InstructorViewClassRequestListDataResponse extends DataResponse(InstructorViewClassRequestListResponse) {}

class InstructorViewClassRequestDetailResponse extends PickType(BaseClassRequestDto, CLASS_REQUEST_DETAIL_PROJECTION) {}
export class InstructorViewClassRequestDetailDataResponse extends DataResponse(
  InstructorViewClassRequestDetailResponse
) {}

// Management
export class StaffViewClassRequestListDataResponse extends InstructorViewClassRequestListDataResponse {}
class ClassRequestCreatedByDto extends PickType(BaseInstructorDto, ['_id', 'name', 'phone', 'email', 'idCardPhoto', 'avatar']) {}
class StaffViewClassRequestDetailResponse extends InstructorViewClassRequestDetailResponse {
  @ApiProperty({ type: ClassRequestCreatedByDto })
  createdBy: Types.ObjectId | BaseInstructorDto
}
export class StaffViewClassRequestDetailDataResponse extends DataResponse(StaffViewClassRequestDetailResponse) {}
