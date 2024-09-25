import { ArrayMaxSize, IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { BaseMediaDto } from '@media/dto/base-media.dto'

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
}

export class CreateAssignmentDto extends PickType(BaseAssignmentDto, ['title', 'description', 'attachments']) {}
