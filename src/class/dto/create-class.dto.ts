import { ApiProperty, PickType } from '@nestjs/swagger'
import { BaseClassDto } from './base.class.dto'
import { CreateLessonDto } from './lesson.dto'
import { ArrayMaxSize, ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { CreateAssignmentDto } from './assignment.dto'

export class CreateClassDto extends PickType(BaseClassDto, [
  'title',
  'description',
  'price',
  'level',
  'type',
  'thumbnail',
  'media',
  'learnerLimit'
]) {
  @ApiProperty({ type: CreateLessonDto, isArray: true })
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(10)
  @Type(() => CreateLessonDto)
  @ValidateNested({ each: true })
  lessons: CreateLessonDto[]

  @ApiProperty({ type: CreateAssignmentDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @Type(() => CreateAssignmentDto)
  @ValidateNested({ each: true })
  assignments: CreateAssignmentDto[]
}
