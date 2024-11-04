import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { BaseMediaDto } from '@media/dto/base-media.dto'
import { MediaResourceType } from '@media/contracts/constant'
import { ArrayMediaMaxSize } from '@common/validators/array-media-max-size.validator'
import { BaseAssignmentDto, CreateAssignmentDto } from './assignment.dto'

export class SessionMediaDto extends BaseMediaDto {
  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  isAddedLater: boolean
}

export class BaseSessionDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsMongoId()
  _id: string

  @ApiProperty({ type: Number })
  sessionNumber: number

  @ApiProperty({ type: String, example: 'Session title' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string

  @ApiProperty({ type: String, example: 'Session description' })
  @IsString()
  @MaxLength(500)
  description: string

  @ApiProperty({ type: SessionMediaDto, isArray: true })
  @IsArray()
  @ArrayMediaMaxSize(1, MediaResourceType.video)
  @ArrayMediaMaxSize(10, MediaResourceType.image)
  @Type(() => SessionMediaDto)
  @ValidateNested({ each: true })
  media: SessionMediaDto[]

  @ApiPropertyOptional({ type: BaseAssignmentDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @Type(() => BaseAssignmentDto)
  @ValidateNested({ each: true })
  assignments: BaseAssignmentDto[]
}

export class CreateSessionDto extends PickType(BaseSessionDto, ['title', 'description']) {
  @ApiProperty({ type: BaseMediaDto, isArray: true })
  @IsArray()
  @ArrayMediaMaxSize(1, MediaResourceType.video)
  @ArrayMediaMaxSize(10, MediaResourceType.image)
  @Type(() => BaseMediaDto)
  @ValidateNested({ each: true })
  media: BaseMediaDto[]

  @ApiPropertyOptional({ type: CreateAssignmentDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  @Type(() => CreateAssignmentDto)
  @ValidateNested({ each: true })
  assignments: CreateAssignmentDto[]
}

export class UpdateSessionDto extends CreateSessionDto {}

export class UploadSessionResourcesDto {
  @ApiProperty({ type: SessionMediaDto, isArray: true })
  @IsArray()
  @ArrayMediaMaxSize(1, MediaResourceType.video)
  @ArrayMediaMaxSize(2, MediaResourceType.image)
  @Type(() => SessionMediaDto)
  @ValidateNested({ each: true })
  media: SessionMediaDto[]
}
