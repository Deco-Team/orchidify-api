import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseCourseDto } from './base.course.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import {
  COURSE_COMBO_LIST_PROJECTION,
  COURSE_COMBO_DETAIL_PROJECTION,
  CHILD_COURSE_COMBO_DETAIL_PROJECTION
} from '@course/contracts/constant'
import { CourseInstructorDto } from './view-course.dto'

export class QueryCourseComboDto {
  @ApiPropertyOptional({
    description: 'Title to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  title: string
}

export class StaffQueryCourseComboDto extends QueryCourseComboDto {}

class CourseComboListItemResponse extends PickType(BaseCourseDto, COURSE_COMBO_LIST_PROJECTION) {
  @ApiProperty({ type: CourseInstructorDto })
  instructor: CourseInstructorDto
}
class CourseComboListResponse extends PaginateResponse(CourseComboListItemResponse) {}
export class CourseComboListDataResponse extends DataResponse(CourseComboListResponse) {}

class ChildCourseComboDetailResponse extends PickType(BaseCourseDto, CHILD_COURSE_COMBO_DETAIL_PROJECTION) {}
class CourseComboDetailResponse extends PickType(BaseCourseDto, COURSE_COMBO_DETAIL_PROJECTION) {
  @ApiProperty({ type: ChildCourseComboDetailResponse, isArray: true })
  childCourses: ChildCourseComboDetailResponse[]
}
export class CourseComboDetailDataResponse extends DataResponse(CourseComboDetailResponse) {}


// Staff view
class StaffViewCourseComboListItemResponse extends PickType(BaseCourseDto, COURSE_COMBO_LIST_PROJECTION) {
  @ApiProperty({ type: CourseInstructorDto })
  instructor: CourseInstructorDto
}
class StaffViewCourseComboListResponse extends PaginateResponse(StaffViewCourseComboListItemResponse) {}
export class StaffViewCourseComboListDataResponse extends DataResponse(StaffViewCourseComboListResponse) {}

class StaffViewCourseComboDetailResponse extends CourseComboDetailResponse {
  @ApiProperty({ type: CourseInstructorDto })
  instructor: CourseInstructorDto
}
export class StaffViewCourseComboDetailDataResponse extends DataResponse(StaffViewCourseComboDetailResponse) {}
