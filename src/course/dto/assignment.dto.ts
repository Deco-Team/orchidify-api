import { IsArray, IsMongoId, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { BaseMediaDto } from '@media/dto/base-media.dto'

export class BaseAssignmentDto {
  @ApiProperty({ type: String })
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

  @ApiProperty({ type: BaseMediaDto })
  @IsNotEmpty()
  @Type(() => BaseMediaDto)
  @ValidateNested()
  attachment: BaseMediaDto
}

export class CreateAssignmentDto extends PickType(BaseAssignmentDto, ['title', 'description', 'attachment']) {}
