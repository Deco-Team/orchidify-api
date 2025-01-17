import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseClassDto } from './base.class.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator'
import { ClassStatus, CourseLevel } from '@common/contracts/constant'
import { Transform, Type } from 'class-transformer'
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
import { MY_CLASS_INSTRUCTOR_DETAIL_PROJECTION } from '@instructor/contracts/constant'

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

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1_000)
  @Max(10_000_000)
  fromPrice: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1_000)
  @Max(10_000_000)
  toPrice: number
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
class StaffViewClassListItemResponse extends PickType(BaseClassDto, CLASS_LIST_PROJECTION) {
  @ApiProperty({ type: ClassCourseDetailResponse })
  course: ClassCourseDetailResponse

  @ApiProperty({ type: ClassInstructorDetailResponse })
  instructor: ClassInstructorDetailResponse
}
class StaffViewClassListResponse extends PaginateResponse(StaffViewClassListItemResponse) {}
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
class GardenManagerViewClassDetailResponse extends PickType(BaseClassDto, GARDEN_MANAGER_VIEW_CLASS_DETAIL_PROJECTION) {
  @ApiProperty({ type: ClassInstructorDetailResponse })
  instructor: ClassInstructorDetailResponse

  @ApiProperty({ type: ClassCourseDetailResponse })
  course: ClassCourseDetailResponse
}
export class GardenManagerViewClassDetailDataResponse extends DataResponse(GardenManagerViewClassDetailResponse) {}

// Learner - My Classes
class LearnerViewMyClassListItemResponse extends PickType(BaseClassDto, LEARNER_VIEW_MY_CLASS_LIST_PROJECTION) {
  @ApiProperty({ type: ClassInstructorDetailResponse })
  instructor: ClassInstructorDetailResponse
}
class LearnerViewMyClassListResponse extends PaginateResponse(LearnerViewMyClassListItemResponse) {}
export class LearnerViewMyClassListDataResponse extends DataResponse(LearnerViewMyClassListResponse) {}

class MyClassInstructorDetailResponse extends PickType(BaseInstructorDto, MY_CLASS_INSTRUCTOR_DETAIL_PROJECTION) {}
class LearnerViewMyClassDetailResponse extends PickType(BaseClassDto, LEARNER_VIEW_MY_CLASS_DETAIL_PROJECTION) {
  @ApiProperty({ type: ClassGardenDetailResponse })
  garden: ClassGardenDetailResponse

  @ApiProperty({ type: MyClassInstructorDetailResponse })
  instructor: MyClassInstructorDetailResponse

  @ApiPropertyOptional({ type: Boolean })
  hasSentFeedback: boolean
}
export class LearnerViewMyClassDetailDataResponse extends DataResponse(LearnerViewMyClassDetailResponse) {}
