import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { BaseMediaDto } from '@media/dto/base-media.dto'
import { VN_TIMEZONE } from '@src/config'
import * as moment from 'moment-timezone'

export class BaseAssignmentDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String, example: 'Assignment title' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string

  @ApiProperty({ type: String, example: 'Assignment description' })
  @IsString()
  @MaxLength(500)
  description: string

  @ApiProperty({ type: BaseMediaDto, isArray: true })
  @IsArray()
  @ArrayMaxSize(1)
  @Type(() => BaseMediaDto)
  @ValidateNested({ each: true })
  attachments: BaseMediaDto[]

  @ApiPropertyOptional({ type: Date })
  @IsDateString()
  deadline: Date
}

export class CreateAssignmentDto extends PickType(BaseAssignmentDto, ['title', 'description', 'attachments']) {}

export class UpdateAssignmentDto {
  @ApiProperty({ type: Date })
  @IsDateString()
  @Transform(({ value }) => (moment(value).tz(VN_TIMEZONE).endOf('date').toISOString())) 
  deadline: Date
}
