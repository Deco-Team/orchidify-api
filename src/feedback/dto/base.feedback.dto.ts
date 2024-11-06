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

export class BaseFeedbackDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: Number })
  @IsInt()
  @Min(0)
  @Max(5)
  rate: number

  @ApiProperty({ type: String })
  @IsString()
  @MaxLength(500)
  comment: string

  @ApiProperty({ type: String })
  @IsMongoId()
  learnerId: string

  @ApiProperty({ type: String })
  @IsMongoId()
  classId: string

  @ApiProperty({ type: String })
  @IsMongoId()
  courseId: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
