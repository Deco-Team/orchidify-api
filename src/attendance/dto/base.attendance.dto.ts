import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { AttendanceStatus } from '@common/contracts/constant'

export class BaseAttendanceDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String, enum: AttendanceStatus })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  note: string

  @ApiProperty({ type: String })
  @IsMongoId()
  learnerId: string

  @ApiProperty({ type: String })
  @IsMongoId()
  slotId: string

  @ApiProperty({ type: String })
  @IsMongoId()
  classId: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
