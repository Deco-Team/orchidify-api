import { IsArray, IsMongoId, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator'
import { ApiProperty, PickType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { BaseMediaDto } from '@media/dto/base-media.dto'
import { MediaResourceType } from '@media/contracts/constant'
import { ArrayMediaMaxSize } from '@common/validators/array-media-max-size.validator'

export class BaseLessonDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String, example: 'Lesson description' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string

  @ApiProperty({ type: String, example: 'Lesson description' })
  @IsString()
  @MaxLength(500)
  description: string

  @ApiProperty({ type: BaseMediaDto, isArray: true })
  @IsArray()
  @ArrayMediaMaxSize(1, MediaResourceType.video)
  @ArrayMediaMaxSize(10, MediaResourceType.image)
  @Type(() => BaseMediaDto)
  @ValidateNested({ each: true })
  media: BaseMediaDto[]
}

export class CreateLessonDto extends PickType(BaseLessonDto, ['title', 'description', 'media']) {}
