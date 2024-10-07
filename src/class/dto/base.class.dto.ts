import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
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
import { ClassStatus, SlotNumber, Weekday } from '@common/contracts/constant'
import { Type } from 'class-transformer'
import { BaseMediaDto } from '@media/dto/base-media.dto'
import { ClassStatusHistory } from '@src/class/schemas/class.schema'
import { CourseLevel } from '@src/common/contracts/constant'
import { BaseLessonDto } from './lesson.dto'
import { BaseAssignmentDto } from './assignment.dto'

export class BaseClassDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String })
  code: string

  @ApiProperty({ type: String, example: 'Class title' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string

  @ApiProperty({ type: String, example: 'Class description' })
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

  @ApiProperty({ type: [String], example: ['Tách chiết'] })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  type: string[]

  @ApiProperty({ type: Number, example: 30 })
  @IsInt()
  @Min(0)
  duration: number

  @ApiProperty({
    type: String,
    example: 'https://res.cloudinary.com/orchidify/image/upload/v1726377866/hcgbmek4qa8kksw2zrcg.jpg'
  })
  @IsUrl()
  thumbnail: string

  @ApiProperty({ type: BaseMediaDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @Type(() => BaseMediaDto)
  @ValidateNested({ each: true })
  media: BaseMediaDto[]

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

  @ApiProperty({ type: String, enum: ClassStatus })
  @IsEnum(ClassStatus)
  status: ClassStatus

  @ApiProperty({ type: ClassStatusHistory, isArray: true })
  histories: ClassStatusHistory[]

  @ApiProperty({ type: Number, example: 20 })
  @IsInt()
  @Min(10)
  @Max(30)
  learnerLimit: number

  @ApiProperty({ type: Number })
  learnerQuantity: number

  @ApiProperty({ enum: Weekday, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ArrayUnique()
  weekdays: Weekday[]

  @ApiProperty({ enum: SlotNumber, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @ArrayUnique()
  slotNumbers: SlotNumber[]

  @ApiPropertyOptional({ type: Number })
  rate: number

  @ApiPropertyOptional({ type: String })
  cancelReason: string

  @ApiProperty({ type: String, example: 'Course Garden Required Toolkits' })
  @IsString()
  @MaxLength(500)
  gardenRequiredToolkits: string

  @ApiProperty({ type: String })
  instructorId: string

  @ApiProperty({ type: String })
  gardenId: string

  @ApiProperty({ type: String })
  courseId: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
