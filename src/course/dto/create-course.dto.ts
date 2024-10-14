import { ApiProperty, PickType } from '@nestjs/swagger'
import { BaseCourseDto } from './base.course.dto'
import { CreateSessionDto } from '@class/dto/session.dto'
import { ArrayMaxSize, ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateCourseDto extends PickType(BaseCourseDto, [
  'title',
  'description',
  'price',
  'level',
  'type',
  'duration',
  'thumbnail',
  'media',
  'learnerLimit',
  'gardenRequiredToolkits'
]) {
  @ApiProperty({ type: CreateSessionDto, isArray: true })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(24)
  @Type(() => CreateSessionDto)
  @ValidateNested({ each: true })
  sessions: CreateSessionDto[]
}
