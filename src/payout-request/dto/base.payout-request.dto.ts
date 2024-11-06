import { IsEnum, IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PayoutRequestStatus } from '@common/contracts/constant'
import { PayoutRequestStatusHistory } from '@src/payout-request/schemas/payout-request.schema'
import { Types } from 'mongoose'
import { BaseClassDto } from '@class/dto/base.class.dto'
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto'
import { BaseStaffDto } from '@staff/dto/base.staff.dto'

export class BasePayoutRequestDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: Number })
  @IsInt()
  @Min(200_000)
  @Max(50_000_000)
  amount: number

  @ApiProperty({ type: String, enum: PayoutRequestStatus })
  @IsEnum(PayoutRequestStatus)
  status: PayoutRequestStatus

  @ApiPropertyOptional({ type: String })
  rejectReason: string

  @ApiProperty({ type: PayoutRequestStatusHistory, isArray: true })
  histories: PayoutRequestStatusHistory[]

  @ApiProperty({ type: String, example: 'Payout Request description' })
  @IsString()
  @MaxLength(500)
  description: string

  @ApiProperty({ type: String })
  @IsMongoId()
  createdBy: Types.ObjectId | BaseInstructorDto

  @ApiProperty({ type: String })
  @IsMongoId()
  handledBy: Types.ObjectId | BaseStaffDto

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsMongoId()
  transactionId: Types.ObjectId | string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}