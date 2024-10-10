import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseCourseDto } from './base.course.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { CourseStatus } from '@common/contracts/constant'
import { Transform } from 'class-transformer'
import { COURSE_LIST_PROJECTION, COURSE_DETAIL_PROJECTION } from '@course/contracts/constant'
import { CourseLevel } from '@src/common/contracts/constant'
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto'

export class QueryCourseDto {
  @ApiPropertyOptional({
    description: 'Title to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  title: string

  @ApiPropertyOptional({
    description: 'Type to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  type: string

  @ApiPropertyOptional({
    enum: CourseLevel,
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  level: CourseLevel[]

  @ApiPropertyOptional({
    enum: [CourseStatus.DRAFT, CourseStatus.ACTIVE, CourseStatus.REQUESTING],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: CourseStatus[]
}

export class StaffQueryCourseDto extends QueryCourseDto {
  @ApiPropertyOptional({
    enum: [CourseStatus.ACTIVE, CourseStatus.REQUESTING],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: CourseStatus[]
}

export class PublicQueryCourseDto extends PickType(QueryCourseDto, ['title', 'type', 'level']) {}

class CourseListItemResponse extends PickType(BaseCourseDto, COURSE_LIST_PROJECTION) {}
class CourseListResponse extends PaginateResponse(CourseListItemResponse) {}
export class CourseListDataResponse extends DataResponse(CourseListResponse) {}

class CourseDetailResponse extends PickType(BaseCourseDto, COURSE_DETAIL_PROJECTION) {}
export class CourseDetailDataResponse extends DataResponse(CourseDetailResponse) {}


class PublicCourseInstructorDto extends PickType(BaseInstructorDto, ['_id', 'name', 'idCardPhoto', 'avatar']) {}

class PublicCourseListItemResponse extends PickType(BaseCourseDto, COURSE_LIST_PROJECTION) {
  @ApiProperty({ type: Number })
  lessonsCount: number

  @ApiProperty({ type: Number })
  assignmentsCount: number

  @ApiProperty({ type: PublicCourseInstructorDto })
  instructor: PublicCourseInstructorDto
}
class PublicCourseListResponse extends PaginateResponse(PublicCourseListItemResponse) {}
export class PublishCourseListDataResponse extends DataResponse(PublicCourseListResponse) {}
