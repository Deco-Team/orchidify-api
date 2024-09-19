import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CourseStatus } from '@common/contracts/constant'
import { Type } from 'class-transformer'
import { BaseMediaDto } from '@media/dto/base-media.dto'
import { CourseStatusHistory } from '@course/schemas/course.schema'
import { CourseLevel } from '@course/contracts/constant'
import { BaseLessonDto } from './lesson.dto'
import { BaseAssignmentDto } from './assignment.dto'

export class BaseCourseDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String, example: 'Course title' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string

  @ApiProperty({ type: String, example: 'Course description' })
  @IsString()
  @MaxLength(500)
  description: string

  @ApiProperty({ type: Date, example: '2024-12-12' })
  @IsDateString()
  startDate: Date

  @ApiProperty({ type: Number, example: 500_000 })
  @IsNumber()
  @Min(0)
  @Max(10_000_000)
  price: number

  @ApiProperty({ type: String, enum: CourseLevel })
  @IsEnum(CourseLevel)
  level: CourseLevel

  @ApiProperty({ type: String, example: 'Orchid' })
  @IsNotEmpty()
  @IsString()
  type: string

  @ApiProperty({ type: Number, example: 30 })
  @IsInt()
  @Min(0)
  duration: number

  @ApiProperty({ type: String, example: 'https://res.cloudinary.com/orchidify/image/upload/v1726377866/hcgbmek4qa8kksw2zrcg.jpg' })
  @IsUrl()
  thumbnail: string

  @ApiProperty({ type: BaseMediaDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @Type(() => BaseMediaDto)
  @ValidateNested({ each: true })
  media: BaseMediaDto[]

  @ApiProperty({ type: String, enum: CourseStatus })
  @IsEnum(CourseStatus)
  status: CourseStatus

  @ApiProperty({ type: CourseStatusHistory, isArray: true })
  histories: CourseStatusHistory[]

  @ApiProperty({ type: Number, example: 20 })
  @IsInt()
  @Min(10)
  @Max(30)
  learnerLimit: number

  @ApiProperty({ type: Number })
  learnerQuantity: number

  @ApiProperty({ type: String })
  instructorId: string

  @ApiProperty({ type: String })
  gardenId: string

  @ApiPropertyOptional({ type: Number })
  rate: number

  @ApiPropertyOptional({ type: String })
  cancelReason: string

  @ApiProperty({ type: BaseLessonDto, isArray: true })
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(10)
  @Type(() => BaseLessonDto)
  @ValidateNested({ each: true })
  lessons: BaseLessonDto[]

  @ApiProperty({ type: BaseAssignmentDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @Type(() => BaseAssignmentDto)
  @ValidateNested({ each: true })
  assignments: BaseAssignmentDto[]

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
