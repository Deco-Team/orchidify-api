import { ApiProperty, PickType } from '@nestjs/swagger'
import { BaseCourseDto } from './base.course.dto'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class UpdateCourseComboDto extends PickType(BaseCourseDto, ['discount', 'childCourseIds']) {
  @ApiProperty({ type: String, example: 'Course Combo title' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string

  @ApiProperty({ type: String, example: 'Course Combo description' })
  @IsString()
  @MaxLength(500)
  description: string
}
