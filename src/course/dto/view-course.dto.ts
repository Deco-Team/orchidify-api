import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseCourseDto } from './base.course.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator'
import { CourseStatus } from '@common/contracts/constant'
import { Transform, Type } from 'class-transformer'
import { COURSE_LIST_PROJECTION, COURSE_DETAIL_PROJECTION } from '@course/contracts/constant'
import { CourseLevel } from '@src/common/contracts/constant'
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto'
import { BaseSessionDto } from '@class/dto/session.dto'
import { BaseClassDto } from '@class/dto/base.class.dto'
import { BaseGardenDto } from '@garden/dto/base.garden.dto'
import { PUBLIC_COURSE_CLASS_DETAIL_PROJECTION } from '@class/contracts/constant'
import { COURSE_INSTRUCTOR_DETAIL_PROJECTION } from '@instructor/contracts/constant'
import { BaseLearnerDto } from '@learner/dto/base.learner.dto'
import { MAX_PRICE, MIN_PRICE } from '@src/config'

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
    enum: [CourseStatus.DRAFT, CourseStatus.ACTIVE],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: CourseStatus[]
}

export class StaffQueryCourseDto extends QueryCourseDto {
  @ApiPropertyOptional({
    enum: [CourseStatus.ACTIVE],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: CourseStatus[]
}

export class PublicQueryCourseDto extends PickType(QueryCourseDto, ['title', 'type', 'level']) {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(MIN_PRICE)
  @Max(MAX_PRICE)
  fromPrice: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(MIN_PRICE)
  @Max(MAX_PRICE)
  toPrice: number
}

export class CourseInstructorDto extends PickType(BaseInstructorDto, COURSE_INSTRUCTOR_DETAIL_PROJECTION) {}
class CourseListItemResponse extends PickType(BaseCourseDto, COURSE_LIST_PROJECTION) {
  @ApiProperty({ type: CourseInstructorDto })
  instructor: CourseInstructorDto
}
class CourseListResponse extends PaginateResponse(CourseListItemResponse) {}
export class CourseListDataResponse extends DataResponse(CourseListResponse) {}

class CourseDetailResponse extends PickType(BaseCourseDto, COURSE_DETAIL_PROJECTION) {
  @ApiProperty({ type: CourseInstructorDto })
  instructor: CourseInstructorDto
}
export class CourseDetailDataResponse extends DataResponse(CourseDetailResponse) {}

class PublicCourseListItemResponse extends PickType(BaseCourseDto, COURSE_LIST_PROJECTION) {
  // @ApiProperty({ type: Number })
  // sessionsCount: number

  @ApiProperty({ type: CourseInstructorDto })
  instructor: CourseInstructorDto

  @ApiProperty({ type: Number })
  classesCount: number
}
class PublicCourseListResponse extends PaginateResponse(PublicCourseListItemResponse) {}
export class PublishCourseListDataResponse extends DataResponse(PublicCourseListResponse) {}

class LearnerViewCourseListItemResponse extends PublicCourseListItemResponse {
  @ApiProperty({ type: Number })
  discount: number

  @ApiProperty({ type: Number })
  finalPrice: number
}
class LearnerViewCourseListResponse extends PaginateResponse(LearnerViewCourseListItemResponse) {}
export class LearnerViewCourseListDataResponse extends DataResponse(LearnerViewCourseListResponse) {}

class PublicCourseClassGardenDto extends PickType(BaseGardenDto, ['_id', 'name']) {}
class PublicCourseSessionDto extends PickType(BaseSessionDto, ['_id', 'title']) {}
class PublicCourseLearnerClassDto extends PickType(BaseLearnerDto, ['_id']) {}
class PublicCourseClassDto extends PickType(BaseClassDto, PUBLIC_COURSE_CLASS_DETAIL_PROJECTION) {
  @ApiProperty({ type: PublicCourseClassGardenDto })
  garden: PublicCourseClassGardenDto

  @ApiPropertyOptional({ type: PublicCourseLearnerClassDto })
  learnerClass: PublicCourseLearnerClassDto
}
class PublicCourseDetailResponse extends PickType(BaseCourseDto, COURSE_DETAIL_PROJECTION) {
  @ApiProperty({ type: CourseInstructorDto })
  instructor: CourseInstructorDto

  @ApiProperty({ type: PublicCourseSessionDto, isArray: true })
  sessions: BaseSessionDto[]

  @ApiProperty({ type: PublicCourseClassDto, isArray: true })
  classes: PublicCourseClassDto
}
export class PublicCourseDetailDataResponse extends DataResponse(PublicCourseDetailResponse) {}

class LearnerViewCourseDetailResponse extends PublicCourseDetailResponse {
  @ApiProperty({ type: Number })
  discount: number

  @ApiProperty({ type: Number })
  finalPrice: number
}
export class LearnerViewCourseDetailDataResponse extends DataResponse(LearnerViewCourseDetailResponse) {}