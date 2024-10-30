import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { BaseMediaDto } from '@media/dto/base-media.dto'
import { SubmissionStatus } from '@common/contracts/constant'

export class BaseAssignmentSubmissionDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: BaseMediaDto, isArray: true })
  @IsArray()
  @ArrayMaxSize(1)
  @Type(() => BaseMediaDto)
  @ValidateNested({ each: true })
  attachments: BaseMediaDto[]

  @ApiPropertyOptional({ type: Number })
  @IsInt()
  @Min(0)
  @Max(10)
  point: number

  @ApiPropertyOptional({ type: String, example: 'Assignment submission feedback' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  feedback: string

  @ApiProperty({ type: String, enum: SubmissionStatus })
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus

  @ApiProperty({ type: String })
  @IsMongoId()
  assignmentId: string

  @ApiProperty({ type: String })
  @IsMongoId()
  classId: string

  @ApiProperty({ type: String })
  @IsMongoId()
  learnerId: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}

export class CreateAssignmentSubmissionDto extends PickType(BaseAssignmentSubmissionDto, [
  'assignmentId',
  'attachments'
]) {
  learnerId: string
  classId: string
}

export class GradeAssignmentSubmissionDto extends PickType(BaseAssignmentSubmissionDto, ['point', 'feedback']) {}
