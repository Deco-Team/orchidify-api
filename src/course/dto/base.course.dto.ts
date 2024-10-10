import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
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
import { CourseLevel } from '@src/common/contracts/constant'
import { BaseLessonDto } from '@src/class/dto/lesson.dto'
import { BaseAssignmentDto } from '@src/class/dto/assignment.dto'

export class BaseCourseDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String, example: 'Course code' })
  code: string

  @ApiProperty({ type: String, example: 'Course title' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string

  @ApiProperty({ type: String, example: 'Course description' })
  @IsString()
  @MaxLength(500)
  description: string

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

  @ApiProperty({ type: String, enum: CourseStatus })
  @IsEnum(CourseStatus)
  status: CourseStatus

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

  @ApiProperty({ type: Number, example: 20 })
  @IsInt()
  @Min(10)
  @Max(30)
  learnerLimit: number

  @ApiPropertyOptional({ type: Number })
  rate: number

  @ApiProperty({ type: Number, example: 20 })
  @IsInt()
  @Min(5)
  @Max(50)
  discount: number

  @ApiProperty({ type: String, example: 'Course Garden Required Toolkits' })
  @IsString()
  @MaxLength(500)
  gardenRequiredToolkits: string

  @ApiProperty({ type: String })
  instructorId: string

  @ApiPropertyOptional({ type: Boolean })
  isPublished: Boolean

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
