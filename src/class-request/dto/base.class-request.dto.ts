import { IsEnum, IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ClassRequestStatus, ClassRequestType } from '@common/contracts/constant'
import { ClassRequestStatusHistory } from '@src/class-request/schemas/class-request.schema'
import { Types } from 'mongoose'
import { BaseClassDto } from '@class/dto/base.class.dto'
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto'

class BaseClassRequestMetadataDto extends BaseClassDto {}

export class BaseClassRequestDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String, enum: ClassRequestType })
  @IsNotEmpty()
  @IsEnum(ClassRequestType)
  type: ClassRequestType

  @ApiProperty({ type: String, enum: ClassRequestStatus })
  @IsEnum(ClassRequestStatus)
  status: ClassRequestStatus

  @ApiPropertyOptional({ type: String })
  rejectReason: string

  @ApiProperty({ type: ClassRequestStatusHistory, isArray: true })
  histories: ClassRequestStatusHistory[]

  @ApiProperty({ type: String, example: 'Class Request description' })
  @IsString()
  @MaxLength(500)
  description: string

  @ApiProperty({ type: BaseClassRequestMetadataDto })
  metadata: BaseClassRequestMetadataDto

  @ApiProperty({ type: String })
  @IsMongoId()
  createdBy: Types.ObjectId | BaseInstructorDto

  @ApiProperty({ type: String })
  @IsMongoId()
  courseId: Types.ObjectId | string

  @ApiProperty({ type: String })
  @IsMongoId()
  classId: Types.ObjectId | string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
