import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseClassDto } from './base.class.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { ClassStatus, CourseLevel } from '@common/contracts/constant'
import { Transform } from 'class-transformer'
import {
  CLASS_DETAIL_PROJECTION,
  CLASS_LIST_PROJECTION,
  GARDEN_MANAGER_VIEW_CLASS_DETAIL_PROJECTION,
  LEARNER_VIEW_MY_CLASS_DETAIL_PROJECTION,
  LEARNER_VIEW_MY_CLASS_LIST_PROJECTION
} from '@src/class/contracts/constant'
import { BaseGardenDto } from '@garden/dto/base.garden.dto'
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto'
import { LearnerDetailResponse } from '@learner/dto/view-learner.dto'

export class QueryClassDto {
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
    enum: [ClassStatus.PUBLISHED, ClassStatus.IN_PROGRESS, ClassStatus.COMPLETED, ClassStatus.CANCELED],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: ClassStatus[]
}

class ClassInstructorDetailResponse extends PickType(BaseInstructorDto, ['name']) {}
export class ClassGardenDetailResponse extends PickType(BaseGardenDto, ['name']) {}
export class ClassCourseDetailResponse extends PickType(BaseClassDto, ['code']) {}

// Instructor
class InstructorViewClassListItemResponse extends PickType(BaseClassDto, CLASS_LIST_PROJECTION) {
  @ApiProperty({ type: ClassCourseDetailResponse })
  course: ClassCourseDetailResponse
}
class InstructorViewClassListResponse extends PaginateResponse(InstructorViewClassListItemResponse) {}
export class InstructorViewClassListDataResponse extends DataResponse(InstructorViewClassListResponse) {}

class InstructorViewClassDetailResponse extends PickType(BaseClassDto, CLASS_DETAIL_PROJECTION) {
  @ApiProperty({ type: ClassGardenDetailResponse })
  garden: ClassGardenDetailResponse

  @ApiProperty({ type: ClassCourseDetailResponse })
  course: ClassCourseDetailResponse

  @ApiPropertyOptional({ type: LearnerDetailResponse, isArray: true })
  learners: LearnerDetailResponse[]
}
export class InstructorViewClassDetailDataResponse extends DataResponse(InstructorViewClassDetailResponse) {}

// Staff
class StaffViewClassListItemResponse extends PickType(BaseClassDto, CLASS_LIST_PROJECTION) {}
class StaffViewClassListResponse extends PaginateResponse(StaffViewClassListItemResponse) {
  @ApiProperty({ type: ClassCourseDetailResponse })
  course: ClassCourseDetailResponse
}
export class StaffViewClassListDataResponse extends DataResponse(StaffViewClassListResponse) {}

class StaffViewClassDetailResponse extends PickType(BaseClassDto, CLASS_DETAIL_PROJECTION) {
  @ApiProperty({ type: ClassGardenDetailResponse })
  garden: ClassGardenDetailResponse

  @ApiProperty({ type: ClassInstructorDetailResponse })
  instructor: ClassInstructorDetailResponse

  @ApiProperty({ type: ClassCourseDetailResponse })
  course: ClassCourseDetailResponse

  @ApiPropertyOptional({ type: LearnerDetailResponse, isArray: true })
  learners: LearnerDetailResponse[]
}
export class StaffViewClassDetailDataResponse extends DataResponse(StaffViewClassDetailResponse) {}

// GardenManager
class GardenManagerViewClassDetailResponse extends PickType(
  BaseClassDto,
  GARDEN_MANAGER_VIEW_CLASS_DETAIL_PROJECTION
) {}
export class GardenManagerViewClassDetailDataResponse extends DataResponse(GardenManagerViewClassDetailResponse) {}

// Learner - My Classes
class LearnerViewMyClassListItemResponse extends PickType(BaseClassDto, LEARNER_VIEW_MY_CLASS_LIST_PROJECTION) {
  @ApiProperty({ type: ClassInstructorDetailResponse })
  instructor: ClassInstructorDetailResponse
}
class LearnerViewMyClassListResponse extends PaginateResponse(LearnerViewMyClassListItemResponse) {}
export class LearnerViewMyClassListDataResponse extends DataResponse(LearnerViewMyClassListResponse) {}

class LearnerViewMyClassDetailResponse extends PickType(BaseClassDto, LEARNER_VIEW_MY_CLASS_DETAIL_PROJECTION) {
  @ApiProperty({ type: ClassGardenDetailResponse })
  garden: ClassGardenDetailResponse

  @ApiProperty({ type: ClassInstructorDetailResponse })
  instructor: ClassInstructorDetailResponse
}
export class LearnerViewMyClassDetailDataResponse extends DataResponse(LearnerViewMyClassDetailResponse) {}

