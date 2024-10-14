import { ApiProperty, PickType } from '@nestjs/swagger'
import { BaseClassDto } from './base.class.dto'
import { CreateSessionDto } from './session.dto'
import { ArrayMaxSize, ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

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
  @ApiProperty({ type: CreateSessionDto, isArray: true })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(24)
  @Type(() => CreateSessionDto)
  @ValidateNested({ each: true })
  sessions: CreateSessionDto[]
}
