import { ApiProperty, PartialType, PickType } from '@nestjs/swagger'
import { BaseCourseDto } from './base.course.dto'
import { UpdateSessionDto } from '@class/dto/session.dto'
import { ArrayMaxSize, ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateCourseDto extends PickType(BaseCourseDto, [
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
  @ApiProperty({ type: UpdateSessionDto, isArray: true })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(24)
  @Type(() => UpdateSessionDto)
  @ValidateNested({ each: true })
  sessions: UpdateSessionDto[]
}
