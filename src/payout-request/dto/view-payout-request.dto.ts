import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BasePayoutRequestDto } from './base.payout-request.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsOptional } from 'class-validator'
import { PayoutRequestStatus } from '@common/contracts/constant'
import { Transform } from 'class-transformer'
import {
  PAYOUT_REQUEST_DETAIL_PROJECTION,
  PAYOUT_REQUEST_LIST_PROJECTION
} from '@src/payout-request/contracts/constant'
import { Types } from 'mongoose'
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto'

export class QueryPayoutRequestDto {
  @ApiPropertyOptional({
    enum: [
      PayoutRequestStatus.PENDING,
      PayoutRequestStatus.APPROVED,
      PayoutRequestStatus.CANCELED,
      PayoutRequestStatus.EXPIRED,
      PayoutRequestStatus.REJECTED
    ],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: PayoutRequestStatus[]

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Transform(({ value }) => {
    return [true, 'enabled', 'true', 1, '1'].indexOf(value) > -1
  })
  hasMadePayout: boolean

  createdBy: string
}

// Instructor
class InstructorViewPayoutRequestListItemResponse extends PickType(
  BasePayoutRequestDto,
  PAYOUT_REQUEST_LIST_PROJECTION
) {}
class InstructorViewPayoutRequestListResponse extends PaginateResponse(InstructorViewPayoutRequestListItemResponse) {}
export class InstructorViewPayoutRequestListDataResponse extends DataResponse(
  InstructorViewPayoutRequestListResponse
) {}

class InstructorViewPayoutRequestDetailResponse extends PickType(
  BasePayoutRequestDto,
  PAYOUT_REQUEST_DETAIL_PROJECTION
) {}
export class InstructorViewPayoutRequestDetailDataResponse extends DataResponse(
  InstructorViewPayoutRequestDetailResponse
) {}

// Management
class PayoutRequestCreatedByDto extends PickType(BaseInstructorDto, [
  '_id',
  'name',
  'phone',
  'email',
  'idCardPhoto',
  'avatar',
  'paymentInfo'
]) {}

class StaffViewPayoutRequestListItemResponse extends PickType(BasePayoutRequestDto, PAYOUT_REQUEST_LIST_PROJECTION) {
  @ApiProperty({ type: PayoutRequestCreatedByDto })
  createdBy: Types.ObjectId | BaseInstructorDto
}
class StaffViewPayoutRequestListResponse extends PaginateResponse(StaffViewPayoutRequestListItemResponse) {}
export class StaffViewPayoutRequestListDataResponse extends DataResponse(StaffViewPayoutRequestListResponse) {}

class StaffViewPayoutRequestDetailResponse extends InstructorViewPayoutRequestDetailResponse {
  @ApiProperty({ type: PayoutRequestCreatedByDto })
  createdBy: Types.ObjectId | BaseInstructorDto
}
export class StaffViewPayoutRequestDetailDataResponse extends DataResponse(StaffViewPayoutRequestDetailResponse) {}

class ViewPayoutUsageResponse {
  @ApiProperty({ type: Number })
  balance: number

  @ApiProperty({ type: Number })
  usage: number

  @ApiProperty({ type: Number })
  count: number
}
export class ViewPayoutUsageDataResponse extends DataResponse(ViewPayoutUsageResponse) {}
