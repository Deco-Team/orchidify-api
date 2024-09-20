import { ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseCourseDto } from './base.course.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { CourseStatus } from '@common/contracts/constant'
import { Transform } from 'class-transformer'
import {
  INSTRUCTOR_VIEW_COURSE_DETAIL_PROJECTION,
  INSTRUCTOR_VIEW_COURSE_LIST_PROJECTION
} from '@course/contracts/constant'

export class QueryCourseDto {
  @ApiPropertyOptional({
    description: 'Title to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  title: string

  @ApiPropertyOptional({
    enum: CourseStatus,
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: CourseStatus[]
}

class InstructorViewCourseListItemResponse extends PickType(BaseCourseDto, INSTRUCTOR_VIEW_COURSE_LIST_PROJECTION) {}
class InstructorViewCourseListResponse extends PaginateResponse(InstructorViewCourseListItemResponse) {}
export class InstructorViewCourseListDataResponse extends DataResponse(InstructorViewCourseListResponse) {}

class InstructorViewCourseDetailResponse extends PickType(BaseCourseDto, INSTRUCTOR_VIEW_COURSE_DETAIL_PROJECTION) {}
export class InstructorViewCourseDetailDataResponse extends DataResponse(InstructorViewCourseDetailResponse) {}
