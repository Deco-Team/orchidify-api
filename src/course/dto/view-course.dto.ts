import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseCourseDto } from './base.course.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { CourseStatus } from '@common/contracts/constant'
import { Transform } from 'class-transformer'
import { COURSE_LIST_PROJECTION, COURSE_DETAIL_PROJECTION } from '@course/contracts/constant'
import { CourseLevel } from '@src/common/contracts/constant'
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto'
import { BaseSessionDto } from '@class/dto/session.dto'
import { BaseClassDto } from '@class/dto/base.class.dto'
import { BaseGardenDto } from '@garden/dto/base.garden.dto'
import { PUBLIC_COURSE_CLASS_DETAIL_PROJECTION } from '@class/contracts/constant'
import { PUBLIC_COURSE_INSTRUCTOR_DETAIL_PROJECTION } from '@instructor/contracts/constant'

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

class PublicCourseInstructorDto extends PickType(BaseInstructorDto, PUBLIC_COURSE_INSTRUCTOR_DETAIL_PROJECTION) {}
class PublicCourseListItemResponse extends PickType(BaseCourseDto, COURSE_LIST_PROJECTION) {
  // @ApiProperty({ type: Number })
  // sessionsCount: number

  @ApiProperty({ type: PublicCourseInstructorDto })
  instructor: PublicCourseInstructorDto
}
class PublicCourseListResponse extends PaginateResponse(PublicCourseListItemResponse) {}
export class PublishCourseListDataResponse extends DataResponse(PublicCourseListResponse) {}

class PublicCourseClassGardenDto extends PickType(BaseGardenDto, ['_id', 'name']) {}
class PublicCourseSessionDto extends PickType(BaseSessionDto, ['_id', 'title']) {}
class PublicCourseClassDto extends PickType(BaseClassDto, PUBLIC_COURSE_CLASS_DETAIL_PROJECTION) {
  @ApiProperty({ type: PublicCourseClassGardenDto })
  garden: BaseGardenDto
}
class PublicCourseDetailResponse extends PickType(BaseCourseDto, COURSE_DETAIL_PROJECTION) {
  @ApiProperty({ type: PublicCourseInstructorDto })
  instructor: PublicCourseInstructorDto

  @ApiProperty({ type: PublicCourseSessionDto, isArray: true })
  sessions: BaseSessionDto[]

  @ApiProperty({ type: PublicCourseClassDto, isArray: true })
  classes: BaseClassDto
}
export class PublicCourseDetailDataResponse extends DataResponse(PublicCourseDetailResponse) {}
