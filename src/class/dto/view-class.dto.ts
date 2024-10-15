import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseClassDto } from './base.class.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { ClassStatus, CourseLevel } from '@common/contracts/constant'
import { Transform } from 'class-transformer'
import { CLASS_DETAIL_PROJECTION, CLASS_LIST_PROJECTION } from '@src/class/contracts/constant'
import { BaseGardenDto } from '@garden/dto/base.garden.dto'
import { BaseInstructorDto } from '@instructor/dto/base.instructor.dto'

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

class InstructorViewClassListItemResponse extends PickType(BaseClassDto, CLASS_LIST_PROJECTION) {}
class InstructorViewClassListResponse extends PaginateResponse(InstructorViewClassListItemResponse) {}
export class InstructorViewClassListDataResponse extends DataResponse(InstructorViewClassListResponse) {}

class ClassGardenDetailResponse extends PickType(BaseGardenDto, ['name']) {}
class InstructorViewClassDetailResponse extends PickType(BaseClassDto, CLASS_DETAIL_PROJECTION) {
  @ApiProperty({ type: ClassGardenDetailResponse })
  garden: ClassGardenDetailResponse
}
export class InstructorViewClassDetailDataResponse extends DataResponse(InstructorViewClassDetailResponse) {}

class StaffViewClassListItemResponse extends PickType(BaseClassDto, CLASS_LIST_PROJECTION) {}
class StaffViewClassListResponse extends PaginateResponse(StaffViewClassListItemResponse) {}
export class StaffViewClassListDataResponse extends DataResponse(StaffViewClassListResponse) {}

class ClassInstructorDetailResponse extends PickType(BaseInstructorDto, ['name']) {}
class StaffViewClassDetailResponse extends PickType(BaseClassDto, CLASS_DETAIL_PROJECTION) {
  @ApiProperty({ type: ClassGardenDetailResponse })
  garden: ClassGardenDetailResponse

  @ApiProperty({ type: ClassInstructorDetailResponse })
  instructor: ClassInstructorDetailResponse
}
export class StaffViewClassDetailDataResponse extends DataResponse(StaffViewClassDetailResponse) {}
