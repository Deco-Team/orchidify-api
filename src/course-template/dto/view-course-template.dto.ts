import { ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseCourseTemplateDto } from './base.course-template.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { CourseTemplateStatus } from '@common/contracts/constant'
import { Transform } from 'class-transformer'
import {
  INSTRUCTOR_VIEW_COURSE_TEMPLATE_LIST_PROJECTION,
  INSTRUCTOR_VIEW_COURSE_TEMPLATE_DETAIL_PROJECTION
} from '@course-template/contracts/constant'

export class QueryCourseTemplateDto {
  @ApiPropertyOptional({
    description: 'Title to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  title: string

  @ApiPropertyOptional({
    enum: [CourseTemplateStatus.DRAFT, CourseTemplateStatus.ACTIVE, CourseTemplateStatus.REQUESTING],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: CourseTemplateStatus[]
}

class InstructorViewCourseTemplateListItemResponse extends PickType(
  BaseCourseTemplateDto,
  INSTRUCTOR_VIEW_COURSE_TEMPLATE_LIST_PROJECTION
) {}
class InstructorViewCourseTemplateListResponse extends PaginateResponse(InstructorViewCourseTemplateListItemResponse) {}
export class InstructorViewCourseTemplateListDataResponse extends DataResponse(
  InstructorViewCourseTemplateListResponse
) {}

class InstructorViewCourseTemplateDetailResponse extends PickType(
  BaseCourseTemplateDto,
  INSTRUCTOR_VIEW_COURSE_TEMPLATE_DETAIL_PROJECTION
) {}
export class InstructorViewCourseTemplateDetailDataResponse extends DataResponse(
  InstructorViewCourseTemplateDetailResponse
) {}
